import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import * as firebaseAdmin from 'firebase-admin';
import { RiderRepository } from '../rider/rider.repository';
import { RiderService } from '../rider/rider.service';
import { AwsService } from '../../utils/aws.service';
import { AddressService } from '../address/address.service';
import { TrainingService } from '../rider/training.services';
@Injectable()
export class AuthService {
  constructor(
    private readonly riderService: RiderService,
    private readonly riderRepository: RiderRepository,
    private readonly trainingServices: TrainingService,
    private readonly awsService: AwsService,
    private readonly addressService: AddressService,
  ) {}
  // when rider trys login using email password we can authenticate them as rider
  async logIn(body) {
    try {
      const { cnic } = body;
      const cnicFlag = await this.riderService.validateCnic(cnic);
      if (!cnicFlag) {
        throw new BadRequestException('RIDER_E0020');
      }
      const rider = await this.riderRepository.findByCnic(cnic);
      if (rider.status === 'BLOCKED') {
        throw new BadRequestException('RIDER_E0025');
      }
      return {
        body: {
          id: rider.id,
          isVerified: rider.isVerified,
          isTrained: rider.isTrained,
          otp: 999999,
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

  // Create a new rider with rider type and email his temporary password
  async createRider(body) {
    try {
      const {
        email,
        phoneNo,
        cnic,
        bikeNo,
        firstName,
        lastName,
        city,
        country,
        province,
        address,
        fcmToken,
      } = body;
      const emailFlag = await this.riderService.validateEmail(email);
      const phoneNoFlag = await this.riderService.validatePhoneNo(phoneNo);
      const cnicFlag = await this.riderService.validateCnic(cnic);
      const bikeNoFlag = await this.riderService.validateBikeNo(bikeNo);
      if (emailFlag) {
        throw new BadRequestException('RIDER_E0001');
      }
      if (phoneNoFlag) {
        throw new BadRequestException('RIDER_E0002');
      }
      if (cnicFlag) {
        throw new BadRequestException('RIDER_E0003');
      }
      if (bikeNoFlag) {
        throw new BadRequestException('RIDER_E0004');
      }
      let image;
      let url;
      if (body.image) {
        const { originalName, mimeType } = body.image;

        const fileResponse = await this.awsService.getUploadUrl(
          `riders/${Date.now()}-${originalName}`,
          mimeType,
        );
        image = fileResponse.key;
        url = fileResponse.url;
      }

      const addressData = await this.addressService.createAddress({
        city,
        country,
        province,
        address,
      });

      const data = await (
        await this.riderRepository.create({
          firstName,
          lastName,
          email,
          phoneNo,
          cnic,
          bikeNo,
          fcmToken,
          status: 'REGISTERED',
          image,
          addressId: addressData.body.id,
        })
      ).identifiers[0];

      return {
        body: { id: data.id, otp: 999999, image: url },
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

  // verify Otp to phone no of a customer
  async verifyOtp(body) {
    const { otp, cnic } = body;
    try {
      if (otp === 999999) {
        const rider = await this.riderRepository.findByCnic(cnic);
        if (rider.status === 'BLOCKED') {
          throw new BadRequestException('RIDER_E0025');
        }
        const customToken = await this.createCustomToken(rider.id, 'Rider');
        return { body: { id: rider.id, customToken }, isSuccess: true };
      } else {
        throw new BadRequestException('RIDER_E0005');
      }
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // // find training files of  rider for verification
  // async findAllTraining() {
  //   try {
  //     const data = await this.trainingServices.find();
  //     return { body: data, isSuccess: true };
  //   } catch (err) {
  //     return {
  //       code: err.status,
  //       message: err.message,
  //       isSuccess: false,
  //     };
  //   }
  // }

  // update training files of  rider for verification
  async updateTraining(id, body) {
    try {
      const { title, mimeType, originalName } = body;
      const findTitle = await this.trainingServices.findByTitle(title);
      if (findTitle) {
        throw new BadRequestException('RIDER_E0014');
      }
      const training = await this.trainingServices.findById(id);
      this.awsService.deleteFile(training.body.key);
      const fileResponse = await this.awsService.getUploadUrl(
        `training/${id}/${Date.now()}-${originalName}`,
        mimeType,
      );
      const trainingResponse = await this.trainingServices.update(id, {
        title,
        key: fileResponse.key,
      });
      return { body: { fileResponse, trainingResponse }, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // update training files of  rider for verification
  async findOne(id) {
    try {
      return this.trainingServices.findById(id);
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // update training files of  rider for verification
  async publishTraing(id) {
    try {
      return this.trainingServices.publishTraining(id);
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // find training questions and answers of rider for verification
  async findTrainingQuestions(id, roles) {
    try {
      if (roles === 'Rider') {
        const riderData = await this.riderRepository.findById(id);
        if (riderData.branchId == null) {
          throw new BadRequestException('RIDER_E0024');
        }
      }
      return {
        body: [
          {
            question: 'What is the correct spellings?',
            options: ['cheezious', 'abc', 'dsc', 'sasdads'],
            answer: 0,
          },
          {
            question: 'What is the correct spellings?',
            options: ['abc', 'dsc', 'sasdads', 'cheezious'],
            answer: 3,
          },
        ],
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

  // validate training questions and answers of rider for verification
  async validateTrainingQuestions(id, answers) {
    try {
      let riderResponse;
      if (answers[0] === 0 && answers[1] === 3) {
        riderResponse = await this.riderRepository.update(id, {
          isTrained: true,
          status: 'INACTIVE',
        });
      } else {
        throw new BadRequestException('RIDER_E0017');
      }
      return {
        body: riderResponse,
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

  // util functions

  // create a custom Token for rider in firebase
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
    await this.riderService.validateId(id);
  }
}
