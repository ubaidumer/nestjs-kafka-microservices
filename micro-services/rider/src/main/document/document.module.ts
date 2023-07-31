import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentManagement } from 'src/entity/document-management.entity';
import { DocumentController } from './document.controller';
import { DocumentRepository } from './document.repository';
import { DocumentService } from './document.service';
import { AwsService } from 'src/utils/aws.service';
import { RiderModule } from '../rider/rider.module';

@Module({
  imports: [TypeOrmModule.forFeature([DocumentManagement]), RiderModule],
  controllers: [DocumentController],
  providers: [DocumentService, DocumentRepository, AwsService],
})
export class DocumentModule {}
