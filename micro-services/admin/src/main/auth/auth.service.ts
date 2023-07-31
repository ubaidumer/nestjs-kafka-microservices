import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import * as firebaseAdmin from 'firebase-admin';
import { sendMail } from 'src/utils/sendMail';
import { AdminRepository } from '../admin/admin.repository';
import { AdminService } from '../admin/admin.service';
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

// Services to perform all bussiness and required operations
@Injectable()
export class AuthService {
  constructor(
    private readonly adminService: AdminService,
    private readonly adminRepository: AdminRepository,
  ) {}

  // Bussiness functions

  // when admin trys login using google we can authenticate them as admin
  async googleLogin(body) {
    try {
      const { email } = body;
      const emailFlag = await this.adminService.validateEmail(email);
      if (!emailFlag) {
        throw new BadRequestException('ADMIN_E0003');
      } else {
        const admin = await this.adminRepository.findByEmail(email);
        const customToken = await this.createCustomToken(
          admin.id,
          admin.adminType,
        );
        return {
          body: {
            id: admin.id,
            fullName: admin.fullName,
            email: admin.email,
            customToken,
          },
          isSuccess: true,
        };
      }
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // when admin trys login using email password we can authenticate them as admin
  async logIn(body) {
    try {
      const { email, password } = body;
      const emailFlag = await this.adminService.validateEmail(email);
      if (!emailFlag) {
        throw new BadRequestException('ADMIN_E0003');
      }
      const admin = await this.adminRepository.findByEmail(email);
      const passwordFlag = await this.comparePassword(password, admin.password);
      if (!passwordFlag) {
        throw new BadRequestException('ADMIN_E0004');
      }
      const customToken = await this.createCustomToken(
        admin.id,
        admin.adminType,
      );
      return {
        body: {
          id: admin.id,
          fullName: admin.fullName,
          email: admin.email,
          customToken,
        },
        isSuccess: true,
      };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // Create a new admin with admin type and email his temporary password
  async createAdmin(body) {
    try {
      const { fullName, email, adminType, branchIds } = body;
      const password = await this.generateTempPassword();
      const hashcode = await this.hashPassword(password);
      const emailFlag = await this.adminService.validateEmail(email);
      if (emailFlag) {
        throw new BadRequestException('ADMIN_E0001');
      }
      const data = await (
        await this.adminService.createAdmin({
          fullName,
          email,
          password: hashcode,
          adminType,
          branchIds,
        })
      ).identifiers[0];

      await sendMail(email, password);
      const tempPasswordLink = await this.sendEmail(email, password);
      return { body: { id: data.id, tempPasswordLink }, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // Create a new admin with admin type and email his temporary password
  async getAdminDetail(id) {
    try {
      const data = await this.adminService.findOneAdmin(id);
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // Update admin function
  async updateAdmin(id, body) {
    try {
      const data = await this.adminService.updateAdmin(id, body);
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // search Admin service function
  async findAllAdmin(query) {
    try {
      const data = await this.adminService.findAllAdmin(query);
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // util functions

  // create a custom Token for Admin in firebase
  async createCustomToken(uid, userType) {
    const additionalClaims = {
      userType,
    };
    const customToken = await firebaseAdmin
      .auth()
      .createCustomToken(uid, additionalClaims);
    return customToken;
  }

  async validateId(id) {
    await this.adminService.validateId(id);
  }

  // hash a password
  async hashPassword(plaintextPassword) {
    const hash = await bcrypt.hash(plaintextPassword, 10);
    return hash;
  }

  // compare hash with password to check comparison
  async comparePassword(plaintextPassword, hash) {
    const result = await bcrypt.compare(plaintextPassword, hash);
    return result;
  }

  // Generate a temporary password with defualt param of 10 length
  async generateTempPassword(length = 10) {
    const result = await Math.round(
      Math.pow(36, length + 1) - Math.random() * Math.pow(36, length),
    )
      .toString(36)
      .slice(1);
    return result;
  }

  // send emails to a reciever
  async sendEmail(email, password) {
    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Ubaid Umer 👻" <ubaid.umer@frizhub.com>', // sender address
      to: `${email}`, // list of receivers
      subject: 'Admin Dashboard Temporary Password', // Subject line
      text:
        'Your temporary password is:' +
        `"${password}"` +
        '.please try to change your password from admin dashboard as soon as you want.', // plain text body
    });

    return nodemailer.getTestMessageUrl(info);
  }
}
