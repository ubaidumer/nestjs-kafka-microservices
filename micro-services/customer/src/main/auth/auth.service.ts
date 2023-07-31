import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { CustomerRepository } from '../customer/customer.repository';
import { CustomerService } from '../customer/customer.service';
import * as firebaseAdmin from 'firebase-admin';
const DeviceDetector = require('node-device-detector');
import { TwilioService } from 'nestjs-twilio';
import { configService } from 'src/config/config';

// Services to perform all bussiness and required operations
@Injectable()
export class AuthService {
  constructor(
    private readonly customerService: CustomerService,
    private readonly customerRepository: CustomerRepository,
    private readonly twilioService: TwilioService,
  ) {}

  // Bussiness functions

  // when customer skips signup/login we can authenticate them as a guest customer
  async guestRegisteration(request) {
    try {
      const data = await (
        await this.customerRepository.create(request)
      ).identifiers[0];
      const customToken = await this.createCustomToken(data.id, 'Guest');
      return { body: { id: data.id, customToken }, isSuccess: true };
    } catch (err) {
      return { code: err.status, message: err.message, isSuccess: false };
    }
  }

  // onboarding of a guest type customer and updated customer type into authorized customer
  async guestOnboarding(id, body) {
    try {
      const { email, phoneNo } = body;
      await this.customerService.validatephoneNo(phoneNo);
      await this.customerService.validateEmail(email);
      await this.customerRepository.update(id, body);
      const customToken = await this.createCustomToken(id, 'Customer');
      return { body: { id, customToken }, isSuccess: true };
    } catch (err) {
      return { code: err.status, message: err.message, isSuccess: false };
    }
  }

  // onboarding of an authorized type customer
  async customerOnboarding(req, body) {
    try {
      const { email, phoneNo } = body;
      await this.customerService.validatephoneNo(phoneNo);
      if (email) {
        await this.customerService.validateEmail(email);
      }
      if (body.dob) {
        const date = await this.dateFormating(body.dob);
        body.dob = date;
      }
      const data = await (
        await this.customerRepository.create({ ...body, ...req })
      ).identifiers[0];
      const customToken = await this.createCustomToken(data.id, 'Customer');
      return { body: { id: data.id, customToken }, isSuccess: true };
    } catch (err) {
      return { code: err.status, message: err.message, isSuccess: false };
    }
  }

  // send Otp to phone no of a customer
  async sendOtp(body) {
    const { phoneNo, channelType } = body;
    const checkPhoneNumber = await this.customerRepository.findByPhoneNo(
      phoneNo,
    );
    let phoneNumberExist;
    if (checkPhoneNumber) {
      phoneNumberExist = true;
    } else {
      phoneNumberExist = false;
    }
    try {
      if (!configService.isProduction()) {
        return { body: { otp: 999999, phoneNumberExist }, isSuccess: true };
      } else {
        const serviceId = configService.getTwilioVerifyService().serviceSid;
        const otpResposne = await this.twilioService.client.verify.v2
          .services(serviceId)
          .verifications.create({ to: phoneNo, channel: channelType });
        return { body: { otpResposne, phoneNumberExist }, isSuccess: true };
      }
    } catch (err) {
      return { code: err.status, message: 'CUSTOMER_E0011', isSuccess: false };
    }
  }

  // onboarding of an authorized type customer by admin actions
  async userOnboardingByAdmin(body) {
    try {
      const { phoneNo } = body;
      await this.customerService.validatephoneNo(phoneNo);
      const data = await (
        await this.customerRepository.create(body)
      ).identifiers[0];

      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // verify Otp to phone no of a customer
  async verifyOtp(body) {
    const { taskType, otp, phoneNo } = body;
    try {
      //bypass twillio for development
      if (!configService.isProduction()) {
        if (otp === 999999) {
          if (taskType === 'logIn') {
            const customer = await this.customerRepository.findByPhoneNo(
              phoneNo,
            );
            const customToken = await this.createCustomToken(
              customer.id,
              'Customer',
            );
            return {
              body: {
                customToken,
                id: customer.id,
              },
              isSuccess: true,
            };
          }
          return {
            body: null,
            isSuccess: true,
          };
        } else {
          return {
            code: 400,
            message: 'CUSTOMER_E0012',
            isSuccess: false,
          };
        }
      }

      //without bypass twillio for development
      const serviceId = configService.getTwilioVerifyService().serviceSid;
      const otpResponse = await this.twilioService.client.verify.v2
        .services(serviceId)
        .verificationChecks.create({ to: phoneNo, code: otp });

      if (taskType === 'logIn') {
        const customer = await this.customerRepository.findByPhoneNo(phoneNo);
        const customToken = await this.createCustomToken(
          customer.id,
          'Customer',
        );
        return {
          body: {
            otpResponse,
            customToken,
            id: customer.id,
          },
          isSuccess: true,
        };
      }

      return { body: otpResponse, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: 'CUSTOMER_E0012',
        isSuccess: false,
      };
    }
  }

  // util functions

  // device dectector function for OS,Client and device information
  async requestInfo(req) {
    const detector = new DeviceDetector({
      clientIndexes: true,
      deviceIndexes: true,
      deviceAliasCode: false,
    });
    const userAgent = req.headers['user-agent'];
    const result = detector.detect(userAgent);
    return result;
  }

  // create a custom Token for Guest or Anonymous User in firebase
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
    await this.customerService.validateId(id);
  }

  async dateFormating(dates) {
    const d = new Date(dates);
    const date = d.getDate();
    const month = d.getMonth();
    const year = d.getFullYear();
    return new Date(year, month, date);
  }
}
