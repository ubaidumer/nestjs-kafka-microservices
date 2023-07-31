import { BadRequestException, Injectable } from '@nestjs/common';
import { complianceRepository } from './compliance.repository';
import { AwsService } from 'src/utils/aws.service';
import { RiderService } from '../rider/rider.service';
import { complianceStatusCategory } from 'src/utils/constants/complianceConstants';

// Services to perform all bussiness and required operations
@Injectable()
export class ComplianceService {
  constructor(
    private readonly complianceRepository: complianceRepository,
    private readonly riderService: RiderService,
    private readonly awsService: AwsService,
  ) {}

  // Bussiness functions

  // create rider Compliance service function
  async createCompliance(id, body) {
    try {
      const { documentType, originalName, mimeType } = body;
      const fileResponse = await this.awsService.getUploadUrl(
        `compliances/${documentType}/${id}/${Date.now()}-${originalName}`,
        mimeType,
      );
      const data = await this.complianceRepository.findByRiderIdAndTodayDate(
        id,
        'MANDATORY',
      );

      let complianceResponse;

      if (data) {
        let document = { ...data.document };

        // edge case for documents allready done but want to compliance again
        if (document.bag && document.bikeVideo && document.picture) {
          let document = {};
          document[`${documentType}`] = {
            key: fileResponse.key,
            status: 'PENDING',
          };
          complianceResponse = (
            await this.complianceRepository.create({
              document,
              riderId: id,
            })
          ).identifiers[0];
          return {
            body: { fileResponse, complianceResponse },
            isSuccess: true,
          };
        }

        for (const prop in document) {
          if (documentType.toLowerCase() === `${prop}`) {
            this.awsService.deleteFile(document[`${prop}`].key);
          }
        }
        document[`${documentType}`] = {
          key: fileResponse.key,
          status: 'PENDING',
        };
        complianceResponse = await this.complianceRepository.update(data.id, {
          document,
        });
        if (document.bag && document.bikeVideo && document.picture) {
          await this.riderService.updateRider(id, {
            status: 'ACTIVE',
          });
        }
      } else {
        let document = {};
        document[`${documentType}`] = {
          key: fileResponse.key,
          status: 'PENDING',
        };
        complianceResponse = (
          await this.complianceRepository.create({
            document,
            riderId: id,
          })
        ).identifiers[0];
      }

      return { body: { fileResponse, complianceResponse }, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // random rider Compliance service function
  async randomCompliance(id, body) {
    try {
      const { documentType, originalName, mimeType } = body;
      const data = await this.complianceRepository.findByRiderIdAndTodayDate(
        id,
        'RANDOM',
      );

      let complianceResponse, fileResponse;

      if (data) {
        fileResponse = await this.awsService.getUploadUrl(
          `compliances/${documentType}/${id}/${Date.now()}-${originalName}`,
          mimeType,
        );

        let document = { ...data.document };

        for (const prop in document) {
          if (documentType.toLowerCase() === `${prop}`) {
            this.awsService.deleteFile(document[`${prop}`].key);
          }
        }

        document[`${documentType}`] = {
          key: fileResponse.key,
          status: 'PENDING',
        };
        complianceResponse = await this.complianceRepository.update(data.id, {
          document,
        });
      } else {
        throw new BadRequestException('RIDER_E0024');
      }

      return { body: { fileResponse, complianceResponse }, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // request one compliance using by admin route
  async requestComplianceByAdmin(body) {
    try {
      const complianceResponse = (
        await this.complianceRepository.create({
          ...body,
          type: 'RANDOM',
          document: {},
          status: 'SENT',
        })
      ).identifiers[0];

      return { body: complianceResponse, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // update one compliance using compliance id route
  async updateCompliance(adminId, id, body) {
    try {
      if (body.rating > 0) {
        body.status = complianceStatusCategory[1];
      }
      body.adminId = adminId;
      const data = await this.complianceRepository.update(id, body);
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // find all riders compliance route
  async findAllCompliance(query) {
    try {
      const {
        page = 0,
        limit = 10,
        status,
        sort,
        name,
        branchId,
        type,
      } = query;
      const data = await this.complianceRepository.find({
        skip: page * limit,
        take: limit,
        sort,
        status,
        name,
        branchId,
        type,
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

  // find one compliance using compliance id route
  async findOneCompliance(id) {
    try {
      await this.validateId(id);
      const data = await this.complianceRepository.findById(id);
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  //util functions

  // validates Address id
  async validateId(id) {
    const checkId = await this.complianceRepository.findById(id);
    if (id !== null && !checkId) {
      throw new BadRequestException('RIDER_E0018');
    }
    return;
  }
}
