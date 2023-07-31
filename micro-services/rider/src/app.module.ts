import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configService } from './config/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { RiderModule } from './main/rider/rider.module';
import { AuthModule } from './main/auth/auth.module';
import { LeaveManagementModule } from './main/leave-management/leave-management.module';
import { AwsService } from './utils/aws.service';
import { FeedbackModule } from './main/feedback/feedback.module';
import { ComplianceModule } from './main/compliance/compliance.module';
import { FinancialAssistanceModule } from './main/financial-assistance/financial-assistance.module';
import { ShiftManagementModule } from './main/shift-managements/shift-management.module';
import { DocumentModule } from './main/document/document.module';
import { FAQSModule } from './main/faqs/faqs.module';
@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RiderModule,
    AuthModule,
    LeaveManagementModule,
    FeedbackModule,
    ComplianceModule,
    FinancialAssistanceModule,
    ShiftManagementModule,
    DocumentModule,
    FAQSModule,
  ],
  controllers: [AppController],
  providers: [AppService, AwsService],
})
export class AppModule {}
