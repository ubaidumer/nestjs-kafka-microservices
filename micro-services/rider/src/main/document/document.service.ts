import { BadRequestException, Injectable } from '@nestjs/common';
import { DocumentRepository } from './document.repository';
import { AwsService } from 'src/utils/aws.service';
import { RiderRepository } from '../rider/rider.repository';

// Services to perform all bussiness and required operations
@Injectable()
export class DocumentService {
  constructor(
    private readonly documentRepository: DocumentRepository,
    private readonly awsService: AwsService,
    private readonly riderRepo: RiderRepository,
  ) {}

  // Bussiness functions

  // upload documents of  rider for verification
  async uploadDocument(riderId, body) {
    const { documentType, originalName, mimeType, reason, type } = body;
    try {
      const checkDocument = await this.documentRepository.findByRiderIdAndType(
        riderId,
        type,
      );

      if (checkDocument) {
        throw new BadRequestException('RIDER_E0023');
      }

      const fileResponse = await this.awsService.getUploadUrl(
        `documents/${documentType}/${riderId}/${Date.now()}-${originalName}`,
        mimeType,
      );

      const documentResponse = (
        await this.documentRepository.create({
          status: 'PENDING',
          key: fileResponse.key,
          ...(reason && { reason }),
          type,
          riderId,
        })
      ).identifiers[0];
      const allDocuments = await this.documentRepository.findByRiderId(riderId);

      if (allDocuments.length === 6) {
        const checkRejectedDoc = allDocuments.every((doc) => {
          return doc.status != 'REJECTED' ? true : false;
        });
        if (checkRejectedDoc) {
          this.riderRepo.update(riderId, { status: 'PENDING' });
        }
      } else if (allDocuments.length === 1) {
        this.riderRepo.update(riderId, { status: 'INCOMPLETE' });
      }

      return { body: { documentResponse, fileResponse }, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: 'RIDER_E0022',
        isSuccess: false,
      };
    }
  }

  // update documents of rider for re submission
  async updateDocument(id, body) {
    const { documentType, originalName, mimeType, reason } = body;
    try {
      await this.validateId(id);

      const oldDocument = await this.documentRepository.findById(id);
      this.awsService.deleteFile(oldDocument.key);

      const fileResponse = await this.awsService.getUploadUrl(
        `documents/${documentType}/${id}/${Date.now()}-${originalName}`,
        mimeType,
      );

      const documentResponse = await this.documentRepository.update(id, {
        status: 'PENDING',
        key: fileResponse.key,
        ...(reason && { reason }),
      });

      const allDocuments = await this.documentRepository.findByRiderId(
        oldDocument.riderId,
      );

      const checkDoc = allDocuments.some((doc) => {
        return doc.status === 'REJECTED' ? true : false;
      });

      if (!checkDoc) {
        await this.riderRepo.update(oldDocument.riderId, { status: 'PENDING' });
      }

      return { body: { documentResponse, fileResponse }, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message === 'RIDER_E0023' ? 'RIDER_E0023' : 'RIDER_E0022',
        isSuccess: false,
      };
    }
  }

  // verify documents of rider for re submission
  async verifyDocument(id, body) {
    try {
      const { status, reason } = body;
      await this.validateId(id);

      const documentResponse = await this.documentRepository.update(id, {
        status,
      });
      const documentData = await this.documentRepository.findById(id);
      if (status === 'REJECTED') {
        this.riderRepo.update(documentData.riderId, { status, reason });
      }

      return {
        body: { ...documentResponse, riderId: documentData.riderId },
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

  async findByRiderIdDocument(riderId) {
    try {
      const data = await this.documentRepository.findByRiderId(riderId);
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // search all Documentes service function
  async findAllDocument(query) {
    try {
      const { page = 0, limit = 10, sort = 'desc', riderId, status } = query;

      const data = await this.documentRepository.find({
        skip: page * limit,
        take: limit,
        sort,
        riderId,
        status,
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

  // search by Document id service function
  async findOneDocument(id) {
    try {
      await this.validateId(id);
      const data = await this.documentRepository.findById(id);
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

  // validates Document id
  async validateId(id) {
    const checkId = await this.documentRepository.findById(id);
    if (id !== null && !checkId) {
      throw new BadRequestException('RIDER_E0021');
    }
    return;
  }
}
