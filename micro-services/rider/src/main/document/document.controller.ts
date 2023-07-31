import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { formatResponse } from 'src/utils/response';
import { DocumentService } from './document.service';

// Routes for Document Api's
@Controller()
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}
  // find all riders Document route
  @MessagePattern('topic-rider-document-findAllDocument')
  async findAllDocument(@Payload() data) {
    const result = await this.documentService.findAllDocument(data.query);
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'RIDER_S6002',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // find one Document using Document id route
  @MessagePattern('topic-rider-document-findOneDocument')
  async findOneDocument(@Payload() data) {
    const result = await this.documentService.findOneDocument(data.param.id);
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'RIDER_S6003',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // find one Document using Document id route
  @MessagePattern('topic-rider-document-findByRiderDocument')
  async findByRiderIdDocument(@Payload() data) {
    const result = await this.documentService.findByRiderIdDocument(data.id);
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'RIDER_S6003',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // Create Document route
  @MessagePattern('topic-rider-document-uploadDocument')
  async uploadDocument(@Payload() data) {
    const result = await this.documentService.uploadDocument(
      data.riderId,
      data.body,
    );
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'RIDER_S6001',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // update one Document using Document id route
  @MessagePattern('topic-rider-document-updateDocument')
  async updateDocument(@Payload() data) {
    const result = await this.documentService.updateDocument(
      data.param.id,
      data.body,
    );
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'RIDER_S6004',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // verify one Document using Document id route
  @MessagePattern('topic-rider-document-verifyDocument')
  async verifyDocument(@Payload() data) {
    const result = await this.documentService.verifyDocument(
      data.param.id,
      data.body,
    );
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'RIDER_S6005',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }
}
