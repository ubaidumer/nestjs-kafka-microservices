import { BadRequestException, Injectable } from '@nestjs/common';
import { RiderRepository } from './rider.repository';
import { AwsService } from '../../utils/aws.service';

// Services to perform all bussiness and required operations
@Injectable()
export class RiderService {
  constructor(
    private readonly riderRepository: RiderRepository,
    private readonly awsService: AwsService,
  ) {}

  // Bussiness functions

  // create Rider service function
  async createRider(body) {
    try {
      const data = await this.riderRepository.create(body);
      return data;
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // search Rider service function
  async findAllRider(query) {
    try {
      const {
        page = 0,
        limit = 10,
        status,
        isVerified,
        sort,
        isOnDelivery,
        branchId,
      } = query;
      const data = await this.riderRepository.find({
        skip: page * limit,
        take: limit,
        status,
        isVerified,
        sort,
        isOnDelivery,
        branchId,
      });
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  async findAllRiderGroupByBranch() {
    try {
      const data = await this.riderRepository.findAllRiderGroupByBranch();
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // search by Rider id service function
  async findOneRider(id) {
    try {
      await this.validateId(id);
      const data = await this.riderRepository.findById(id);
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // update by Rider id service function
  async updateRider(id, body) {
    try {
      const { email, cnic, phoneNo, bikeNo } = body;
      await this.validateId(id);
      const emailFlag = await this.validateEmail(email);
      const phoneNoFlag = await this.validatePhoneNo(phoneNo);
      const cnicFlag = await this.validateCnic(cnic);
      const bikeNoFlag = await this.validateBikeNo(bikeNo);
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
      let imageURL;
      if (body.image) {
        const { originalName, mimeType } = body.image;
        let rider = await this.riderRepository.findById(id);
        this.awsService.deleteFile(rider.image);
        const fileResponse = await this.awsService.getUploadUrl(
          `products/${Date.now()}-${originalName}`,
          mimeType,
        );
        body.image = fileResponse.key;
        imageURL = fileResponse.url;
      }
      const data = await this.riderRepository.update(id, body);
      return { body: { ...data, image: imageURL }, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // update by Rider id service function
  async updateRiderByRider(id, body) {
    try {
      const { email, cnic, phoneNo, bikeNo, status } = body;
      const rider = await this.validateId(id);
      const emailFlag = await this.validateEmail(email);
      const phoneNoFlag = await this.validatePhoneNo(phoneNo);
      const cnicFlag = await this.validateCnic(cnic);
      const bikeNoFlag = await this.validateBikeNo(bikeNo);

      if (status && rider.status !== 'ACTIVE') {
        throw new BadRequestException('RIDER_E0018');
      }
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
      let imageURL;
      if (body.image) {
        const { originalName, mimeType } = body.image;
        let rider = await this.riderRepository.findById(id);
        this.awsService.deleteFile(rider.image);
        const fileResponse = await this.awsService.getUploadUrl(
          `products/${Date.now()}-${originalName}`,
          mimeType,
        );
        body.image = fileResponse.key;
        imageURL = fileResponse.url;
      }
      const data = await this.riderRepository.update(id, body);
      return { body: { ...data, image: imageURL }, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  //util functions

  // validates Rider id
  async validateId(id) {
    const checkId = await this.riderRepository.findById(id);
    if (id !== null && !checkId) {
      throw new BadRequestException('RIDER_E0015');
    }
    return checkId;
  }

  // validates Rider email for sign up / login
  async validateEmail(email) {
    const checkEmail = await this.riderRepository.findByEmail(email);
    if (email && checkEmail) {
      return true;
    } else {
      return false;
    }
  }

  // validates Rider phoneNo for sign up / login
  async validatePhoneNo(phoneNo) {
    const checkPhoneNo = await this.riderRepository.findByPhoneNo(phoneNo);
    if (phoneNo && checkPhoneNo) {
      return true;
    } else {
      return false;
    }
  }

  // validates Rider Cnic for sign up / login
  async validateCnic(cnic) {
    const checkCnic = await this.riderRepository.findByCnic(cnic);
    if (cnic && checkCnic) {
      return true;
    } else {
      return false;
    }
  }

  // validates Rider BikeNo for sign up / login
  async validateBikeNo(bikeNo) {
    const checkBikeNo = await this.riderRepository.findByBikeNo(bikeNo);
    if (bikeNo && checkBikeNo) {
      return true;
    } else {
      return false;
    }
  }
}
