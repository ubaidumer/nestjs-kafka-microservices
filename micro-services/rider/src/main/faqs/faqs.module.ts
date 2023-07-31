import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FAQSController } from './faqs.controller';
import { FAQSService } from './faqs.services';
import { FAQSRepository } from './faqs.repository';
import { Faqs } from 'src/entity/faqs.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Faqs])],
  controllers: [FAQSController],
  providers: [FAQSService, FAQSRepository],
})
export class FAQSModule {}
