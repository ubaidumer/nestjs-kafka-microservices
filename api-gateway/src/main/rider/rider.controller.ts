import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';
import { Kafka } from 'kafkajs';
import { take } from 'rxjs';
import { AuthGuard } from 'src/auth.guard';
import { configService } from 'src/config/config';
import { PaginationQueryDTO } from 'src/dto/customer/common.dto';
import { UpdateAddressByRiderDTO } from 'src/dto/rider/address.dto';
import {
  CreatRiderDTO,
  FindRiderByStatusDTO,
  LogInDTO,
  UpdateRiderByAdminDTO,
  UpdateRiderDTO,
  UpdateTrainingRiderDTO,
  UploadTrainingRiderDTO,
  ValidateTrainingDTO,
  VerifyOtpDTO,
} from 'src/dto/rider/auth.dto';
import {
  CompliancePaginationQueryDTO,
  RequestComplianceDocumentsRiderDTO,
  UpdateComplianceRiderDTO,
  UploadComplianceDocumentsRiderDTO,
} from 'src/dto/rider/compliance.dto';
import {
  DocumentPaginationQueryDTO,
  UpdateDocumentDTO,
  UploadDocumentDTO,
  VerifyDocumentDTO,
} from 'src/dto/rider/document.dto';
import {
  CreateFAQSDTO,
  FAQSPaginationDTO,
  UpdateFAQSDTO,
} from 'src/dto/rider/faqs.dto';
import { CreateFeedbackDTO } from 'src/dto/rider/feedback.dto';
import { CreateFinancialAssistanceDTO } from 'src/dto/rider/financialAssistance.dto';
import {
  CreateLeaveDTO,
  UpdateLeaveByAdminDTO,
  UpdateLeaveByRiderDTO,
} from 'src/dto/rider/leave.dto';
import {
  AssignShiftToRiderDTO,
  CreateShiftDTO,
  UpdateShiftToRiderDTO,
} from 'src/dto/rider/shift-management';
import {
  traingPaginationDTO,
  traingStatusChanged,
} from 'src/dto/rider/training.dto';
import { Roles } from 'src/role.decorator';
import { riderTopicArray } from 'src/utils/constant/riderConstants';
import { HttpExceptionFilter } from 'src/utils/exceptionFilter';

// Routes for auth Api's
@Controller('riders')
export class RiderController {
  constructor() {}
  @Client({
    transport: Transport.KAFKA,
    options: {
      client: configService.getKafkaClientConfig('RiderClient'),
      consumer: {
        groupId: 'RIDER_CONSUMER', // Should be the same thing we give in consumer
        allowAutoTopicCreation: true,
      },
    },
  })
  client: ClientKafka;

  async kafkaAdminCreateTopic() {
    const kafka = new Kafka(configService.getKafkaClientConfig('RiderClient'));
    var admin = kafka.admin();

    // create new topic
    await admin.createTopics({
      waitForLeaders: true,
      topics: riderTopicArray,
    });

    // list all topics
    // const topics = await admin.listTopics();
    // console.log(topics);
  }

  async onModuleInit() {
    await this.kafkaAdminCreateTopic();

    // Need to subscribe to topic
    // so that we can get the response from kafka microservice

    riderTopicArray.forEach((element) => {
      this.client.subscribeToResponseOf(element.topic);
    });

    this.client.connect();
  }

  // create a new Rider with a temporary password that he can change later
  @Post('')
  @UseFilters(new HttpExceptionFilter())
  createRider(@Body() body: CreatRiderDTO) {
    return this.client.send(
      'topic-rider-auth-createRider',
      `${JSON.stringify({ body })}`,
    ); // args - topic, message
  }

  // verify otp cnic route for customer
  @Post('/verifyOTP')
  @UseFilters(new HttpExceptionFilter())
  verifyOtp(@Body() body: VerifyOtpDTO) {
    return this.client.send(
      'topic-rider-auth-verifyOtp',
      `${JSON.stringify({ body })}`,
    );
  }

  // authenticate rider by cnic,password login route
  @Post('/riderLogin')
  @UseFilters(new HttpExceptionFilter())
  riderLogin(@Body() body: LogInDTO) {
    return this.client.send(
      'topic-rider-auth-riderLogin',
      `${JSON.stringify({ body })}`,
    );
  }

  // search route for rider
  @UseGuards(AuthGuard)
  @Get()
  @Roles('Admin', 'SuperAdmin', 'RiderManagement', 'RiderComplianceManagement')
  @UseFilters(new HttpExceptionFilter())
  findAllRider(@Query() query: FindRiderByStatusDTO) {
    return this.client.send(
      'topic-rider-auth-findAllRider',
      `${JSON.stringify({ query })}`,
    ); // args - topic, message
  }

  // search route for rider and grouping them according to branchIds
  @UseGuards(AuthGuard)
  @Get('groupByBranch')
  @Roles('Admin', 'SuperAdmin', 'RiderManagement', 'RiderComplianceManagement')
  @UseFilters(new HttpExceptionFilter())
  findAllRiderGroupByBranch() {
    return this.client.send(
      'topic-rider-auth-findAllRiderGroupByBranch',
      `No data Required`,
    ); // args - topic, message
  }

  // search by rider id route for rider
  @UseGuards(AuthGuard)
  @Get('/find/:id')
  @Roles(
    'Admin',
    'SuperAdmin',
    'Customer',
    'RiderManagement',
    'RiderComplianceManagement',
  )
  @UseFilters(new HttpExceptionFilter())
  findOneRider(@Param() param: { id: string }) {
    return this.client.send(
      'topic-rider-auth-findOneRider',
      `${JSON.stringify({ param })}`,
    ); // args - topic, message
  }

  // search by rider id route for rider
  @UseGuards(AuthGuard)
  @Get('/findRider')
  @Roles('Rider')
  @UseFilters(new HttpExceptionFilter())
  findOneRiderByRider(@Req() req) {
    const { id } = req.user;
    return this.client.send(
      'topic-rider-auth-findOneRiderByRider',
      `${JSON.stringify({ id })}`,
    ); // args - topic, message
  }

  // update by Rider id route for Rider
  @UseGuards(AuthGuard)
  @Patch('/update/:id')
  @Roles('Admin', 'SuperAdmin', 'RiderManagement')
  @UseFilters(new HttpExceptionFilter())
  updateRider(
    @Param() param: { id: string },
    @Body() body: UpdateRiderByAdminDTO,
  ) {
    if (body.isVerified === true) {
      const riderObserver = this.client.send(
        'topic-rider-auth-updateRider',
        `${JSON.stringify({ param, body })}`,
      ); // args - topic, message

      const promise1 = new Promise<any>((resolve, reject) => {
        riderObserver.pipe(take(1)).subscribe((result: any) => {
          resolve({
            notification: this.client.send(
              'topic-notification-notifications-createNotification',
              `${JSON.stringify({
                id: param.id,
                notification: {
                  title: 'Documents approved!',
                  body: `Your documents has been approved`,
                },
                android: { priority: 'high' },
                data: {
                  type: 'RIDER_DOCUMENTS_APPROVED',
                  title: 'Documents approved!',
                  body: `Your documents has been approved`,
                },
                apns: {
                  payload: {
                    aps: {
                      alert: {
                        title: 'Documents approved!',
                        body: `Your documents has been approved`,
                      },
                      sound: 'default',
                      mutableContent: 1,
                      contentAvailable: 1,
                    },
                  },
                },
              })}`,
            ),
            result,
          });
        });
      });

      return promise1.then((notificationObserver) => {
        const promise2 = new Promise<void>((resolve, reject) => {
          notificationObserver.notification
            .pipe(take(1))
            .subscribe((result: any) => {
              resolve();
            });
        });
        return promise2.then(() => notificationObserver.result);
      });
    } else {
      return this.client.send(
        'topic-rider-auth-updateRider',
        `${JSON.stringify({ param, body })}`,
      ); // args - topic, message
    }
  }

  // update by Rider id route for Rider
  @UseGuards(AuthGuard)
  @Patch('/updateByRider')
  @Roles('Rider')
  @UseFilters(new HttpExceptionFilter())
  updateRiderByAdmin(@Req() req, @Body() body: UpdateRiderDTO) {
    const { id } = req.user;
    return this.client.send(
      'topic-rider-auth-updateRiderByRider',
      `${JSON.stringify({ id, body })}`,
    ); // args - topic, message
  }

  // upload Rider Training videos and files route for Rider
  @UseGuards(AuthGuard)
  @Post('/uploadTraining')
  @Roles('Admin', 'SuperAdmin', 'RiderManagement')
  @UseFilters(new HttpExceptionFilter())
  uploadRiderTraining(@Req() req, @Body() body: UploadTrainingRiderDTO) {
    const { id } = req.user;
    return this.client.send(
      'topic-rider-auth-uploadTraining',
      `${JSON.stringify({ id, body })}`,
    ); // args - topic, message
  }

  // delete Rider Training videos and files route for Rider
  @UseGuards(AuthGuard)
  @Post('/deleteTraining/:id')
  @Roles('Admin', 'SuperAdmin', 'RiderManagement')
  @UseFilters(new HttpExceptionFilter())
  deleteRiderTraining(@Param() param: { id: string }) {
    return this.client.send(
      'topic-rider-auth-deleteTraining',
      `${JSON.stringify({ param })}`,
    ); // args - topic, message
  }

  // find Rider Training videos and files route for Rider
  @UseGuards(AuthGuard)
  @Get('/findTraining')
  @Roles('Rider', 'Admin', 'SuperAdmin', 'RiderManagement')
  @UseFilters(new HttpExceptionFilter())
  findRiderTraining(@Query() query: traingPaginationDTO) {
    return this.client.send(
      'topic-rider-auth-findAllTraining',
      `${JSON.stringify({ query })}`,
    ); // args - topic, message
  }

  // Update Rider Training videos and files route for Rider
  @UseGuards(AuthGuard)
  @Patch('/updateTraining/:id')
  @Roles('Admin', 'SuperAdmin', 'RiderManagement')
  @UseFilters(new HttpExceptionFilter())
  updateRiderTraining(
    @Param() param: { id: string },
    @Body() body: UpdateTrainingRiderDTO,
  ) {
    return this.client.send(
      'topic-rider-auth-updateTraining',
      `${JSON.stringify({ param, body })}`,
    ); // args - topic, message
  }

  // Update Rider Training videos and files route for Rider
  @UseGuards(AuthGuard)
  @Patch('/publishTraing')
  @Roles('Admin', 'SuperAdmin', 'RiderManagement')
  @UseFilters(new HttpExceptionFilter())
  PublishTraing(@Body() body: traingStatusChanged) {
    return this.client.send(
      'topic-rider-auth-PublishTraing',
      `${JSON.stringify({ body })}`,
    ); // args - topic, message
  }

  // Update Rider Training videos and files route for Rider
  @UseGuards(AuthGuard)
  @Patch('/unPublishTraing')
  @Roles('Admin', 'SuperAdmin', 'RiderManagement')
  @UseFilters(new HttpExceptionFilter())
  upPublishTraing(@Body() body: traingStatusChanged) {
    return this.client.send(
      'topic-rider-auth-unPublishTraing',
      `${JSON.stringify({ body })}`,
    ); // args - topic, message
  }
  // find Rider Training questions and answers route for Rider
  @UseGuards(AuthGuard)
  @Get('/findTrainingQuestions')
  @Roles('Rider', 'Admin', 'SuperAdmin', 'RiderManagement')
  @UseFilters(new HttpExceptionFilter())
  findTrainingQuestions(@Req() req) {
    const { id, role } = req.user;
    return this.client.send(
      'topic-rider-auth-findTrainingQuestions',
      `${JSON.stringify({ id, role })}`,
    ); // args - topic, message
  }

  // validate Rider Training questions and answers route for Rider
  @UseGuards(AuthGuard)
  @Post('/validateTrainingQuestions')
  @Roles('Rider')
  @UseFilters(new HttpExceptionFilter())
  validateTrainingQuestions(@Req() req, @Body() body: ValidateTrainingDTO) {
    const { id } = req.user;
    const riderObserver = this.client.send(
      'topic-rider-auth-validateTrainingQuestions',
      `${JSON.stringify({ id, body })}`,
    ); // args - topic, message

    const promise1 = new Promise<any>((resolve, reject) => {
      riderObserver.pipe(take(1)).subscribe((result: any) => {
        if (result.message === 'RIDER_S0011') {
          resolve({
            notification: this.client.send(
              'topic-notification-notifications-createNotification',
              `${JSON.stringify({
                id: id,
                notification: {
                  title: 'Training approved!',
                  body: `Your training has been approved`,
                },
                android: { priority: 'high' },
                data: {
                  type: 'RIDER_TRAINING_APPROVED',
                  title: 'Training approved!',
                  body: `Your training has been approved`,
                },
                apns: {
                  payload: {
                    aps: {
                      alert: {
                        title: 'Training approved!',
                        body: `Your training has been approved`,
                      },
                      sound: 'default',
                      mutableContent: 1,
                      contentAvailable: 1,
                    },
                  },
                },
              })}`,
            ),
            result,
          });
        } else {
          resolve({
            result,
          });
        }
      });
    });

    return promise1.then((notificationObserver) => {
      const promise2 = new Promise<void>((resolve, reject) => {
        if (notificationObserver.notification) {
          notificationObserver.notification
            .pipe(take(1))
            .subscribe((result: any) => {
              resolve();
            });
        }
        resolve();
      });
      return promise2.then(() => notificationObserver.result);
    });
  }

  // create route for rider Leave
  @UseGuards(AuthGuard)
  @Post('/leave')
  @Roles('Rider')
  @UseFilters(new HttpExceptionFilter())
  createLeave(@Body() body: CreateLeaveDTO, @Req() req) {
    const { id } = req.user;
    return this.client.send(
      'topic-rider-leave-createLeaves',
      `${JSON.stringify({ body: { riderId: id, ...body } })}`,
    ); // args - topic, message
  }

  // search route for all riders Leaves
  @UseGuards(AuthGuard)
  @Get('/leave')
  @Roles('Admin', 'SuperAdmin', 'RiderManagement')
  @UseFilters(new HttpExceptionFilter())
  findAllLeaves(@Query() query: PaginationQueryDTO) {
    return this.client.send(
      'topic-rider-leave-findAllLeaves',
      `${JSON.stringify({ query })}`,
    ); // args - topic, message
  }

  //search by leave id route for rider leave
  @UseGuards(AuthGuard)
  @Get('leave/find/:id')
  @Roles('Admin', 'SuperAdmin', 'RiderManagement')
  @UseFilters(new HttpExceptionFilter())
  findOneLeave(@Param() param: { id: string }) {
    return this.client.send(
      'topic-rider-leave-findOneLeave',
      `${JSON.stringify({ param })}`,
    ); // args - topic, message
  }

  // search by rider id route for rider leaves
  @UseGuards(AuthGuard)
  @Get('/leave/findRider')
  @Roles('Rider')
  @UseFilters(new HttpExceptionFilter())
  findOneRiderAllLeaves(@Req() req, @Query() query: PaginationQueryDTO) {
    const { id } = req.user;
    return this.client.send(
      'topic-rider-leave-findOneRiderAllLeaves',
      `${JSON.stringify({ id, query })}`,
    ); // args - topic, message
  }

  // update route for rider leave
  @UseGuards(AuthGuard)
  @Patch('/leave/riderUpdateLeave/:id')
  @Roles('Rider')
  @UseFilters(new HttpExceptionFilter())
  updateLeaveByRider(
    @Req() req,
    @Body() body: UpdateLeaveByRiderDTO,
    @Param() param: { id: string },
  ) {
    const { id, role } = req.user;
    return this.client.send(
      'topic-rider-leave-updateLeave',
      `${JSON.stringify({ id, param, body: { ...body, role } })}`,
    ); // args - topic, message
  }

  // update route for rider leave
  @UseGuards(AuthGuard)
  @Patch('/leave/adminUpdateLeave/:id')
  @Roles('Admin', 'SuperAdmin', 'RiderManagement')
  @UseFilters(new HttpExceptionFilter())
  updateLeaveByAdmin(
    @Req() req,
    @Body() body: UpdateLeaveByAdminDTO,
    @Param() param: { id: string },
  ) {
    const { id, role } = req.user;
    return this.client.send(
      'topic-rider-leave-updateLeave',
      `${JSON.stringify({ id, param, body: { ...body, role } })}`,
    ); // args - topic, message
  }

  // delete route for Rider Leave
  @UseGuards(AuthGuard)
  @Delete('/leave/delete/:id')
  @Roles('Rider', 'Admin', 'SuperAdmin', 'RiderManagement')
  @UseFilters(new HttpExceptionFilter())
  deleteLeave(@Param() param: { id: string }) {
    return this.client.send(
      'topic-rider-leave-deleteLeaves',
      `${JSON.stringify({ param })}`,
    ); // args - topic, message
  }

  // create route for rider feedback
  @UseGuards(AuthGuard)
  @Post('/feedback')
  @Roles('Customer')
  @UseFilters(new HttpExceptionFilter())
  createFeedback(@Req() req, @Body() body: CreateFeedbackDTO) {
    const { id } = req.user;
    const feedbackObserver = this.client.send(
      'topic-rider-feedback-createFeedback',
      `${JSON.stringify({ id, body })}`,
    ); // args - topic, message
    const promise1 = new Promise<any>((resolve, reject) => {
      feedbackObserver.pipe(take(1)).subscribe((result: any) => {
        resolve(
          {
            notification: this.client.send(
              'topic-notification-notifications-createNotification',
              `${JSON.stringify({
                id: body.riderId,
                notification: {
                  title: 'Feedback received!',
                  body: `You received feedback on your order #${body.orderId}`,
                },
                android: { priority: 'high' },
                data: {
                  type: 'ORDER_FEEDBACK',
                  orderId: body.orderId,
                  title: 'Feedback received!',
                  body: `You received feedback on your order #${body.orderId}`,
                },
                apns: {
                  payload: {
                    aps: {
                      alert: {
                        title: 'Feedback received!',
                        body: `You received feedback on your order #${body.orderId}`,
                      },
                      sound: 'default',
                      category: 'quick-action-category',
                      mutableContent: 1,
                      contentAvailable: 1,
                    },
                  },
                },
              })}`,
            ),
            result,
          }, // args - topic, message
        );
      });
    });

    return promise1.then((notificationObserver) => {
      const promise2 = new Promise<void>((resolve, reject) => {
        notificationObserver.notification
          .pipe(take(1))
          .subscribe((result: any) => {
            resolve();
          });
      });
      return promise2.then(() => notificationObserver.result);
    });
  }

  // search route for all riders feedbacks
  @UseGuards(AuthGuard)
  @Get('/feedback')
  @Roles('Admin', 'SuperAdmin', 'Rider', 'RiderManagement')
  @UseFilters(new HttpExceptionFilter())
  findAllFeedbacks(@Query() query: PaginationQueryDTO) {
    return this.client.send(
      'topic-rider-feedback-findAllFeedbacks',
      `${JSON.stringify({ query })}`,
    ); // args - topic, message
  }

  //search by order id route for rider feedback
  @UseGuards(AuthGuard)
  @Get('feedback/findOrder/:id')
  @Roles('Rider', 'Customer', 'Admin', 'SuperAdmin', 'RiderManagement')
  @UseFilters(new HttpExceptionFilter())
  findOneFeedbackByOrderId(@Param() param: { id: string }) {
    return this.client.send(
      'topic-rider-feedback-findOneFeedbackByOrderId',
      `${JSON.stringify({ param })}`,
    ); // args - topic, message
  }

  // search by rider id route for rider feedbacks
  @UseGuards(AuthGuard)
  @Get('/feedback/findRider')
  @Roles('Rider')
  @UseFilters(new HttpExceptionFilter())
  findOneRiderAllFeedbacks(@Req() req, @Query() query: PaginationQueryDTO) {
    const { id } = req.user;
    return this.client.send(
      'topic-rider-feedback-findOneRiderAllFeedbacks',
      `${JSON.stringify({ id, query })}`,
    ); // args - topic, message
  }

  //   FAQS topis

  // create FAQS route
  @UseGuards(AuthGuard)
  @Post('/faqs')
  @Roles('Admin', 'SuperAdmin')
  @UseFilters(new HttpExceptionFilter())
  createFAQS(@Req() req, @Body() body: CreateFAQSDTO) {
    const { id } = req.user;
    return this.client.send(
      'topic-rider-faqs-createFAQS',
      `${JSON.stringify({ id, body })}`,
    ); // args - topic, message
  }

  // search by rider id route for rider feedbacks
  @UseGuards(AuthGuard)
  @Get('/faqs/find/:id')
  @Roles('Rider', 'Admin', 'SuperAdmin', 'RiderManagement')
  @UseFilters(new HttpExceptionFilter())
  findOneFAQS(@Param() param: { id: string }) {
    return this.client.send(
      'topic-rider-faqs-findFAQSById',
      `${JSON.stringify({ param })}`,
    ); // args - topic, message
  }

  // search route for all riders Leaves
  @UseGuards(AuthGuard)
  @Get('/faqs')
  @Roles('Rider', 'Admin', 'SuperAdmin', 'RiderManagement')
  @UseFilters(new HttpExceptionFilter())
  findAllFAQS(@Query() query: FAQSPaginationDTO) {
    return this.client.send(
      'topic-rider-faqs-findAllFAQS',
      `${JSON.stringify({ query })}`,
    ); // args - topic, message
  }

  // update route for FAQS
  @UseGuards(AuthGuard)
  @Patch('/faqs/update/:id')
  @Roles('Admin', 'SuperAdmin', 'RiderManagement')
  @UseFilters(new HttpExceptionFilter())
  updateFAQS(
    @Req() req,
    @Body() body: UpdateFAQSDTO,
    @Param() param: { id: string },
  ) {
    const { id } = req.user;
    return this.client.send(
      'topic-rider-faqs-updateFAQS',
      `${JSON.stringify({ id, param, body })}`,
    ); // args - topic, message
  }

  // delete route for Rider Leave
  @UseGuards(AuthGuard)
  @Delete('/faqs/delete/:id')
  @Roles('Admin', 'SuperAdmin', 'RiderManagement')
  @UseFilters(new HttpExceptionFilter())
  deleteFAQS(@Param() param: { id: string }) {
    return this.client.send(
      'topic-rider-faqs-deleteFAQS',
      `${JSON.stringify({ param })}`,
    ); // args - topic, message
  }
  // search by customer id route for rider feedbacks
  @UseGuards(AuthGuard)
  @Get('/feedback/findCustomer/:id')
  @Roles('Admin', 'SuperAdmin', 'RiderManagement')
  @UseFilters(new HttpExceptionFilter())
  findOneCustomerAllFeedbacks(
    @Param() param: { id: string },
    @Req() req,
    @Query() query: PaginationQueryDTO,
  ) {
    const { id } = req.user;
    return this.client.send(
      'topic-rider-feedback-findOneCustomerAllFeedbacks',
      `${JSON.stringify({ id, param, query })}`,
    ); // args - topic, message
  }

  // search route for all riders address
  @UseGuards(AuthGuard)
  @Get('/address')
  @Roles('Admin', 'SuperAdmin', 'RiderManagement')
  @UseFilters(new HttpExceptionFilter())
  findAllAddresss(@Query() query: PaginationQueryDTO) {
    return this.client.send(
      'topic-rider-address-findAllAddress',
      `${JSON.stringify({ query })}`,
    ); // args - topic, message
  }

  //search by address id route for rider address
  @UseGuards(AuthGuard)
  @Get('address/find/:id')
  @Roles('Admin', 'SuperAdmin', 'RiderManagement')
  @UseFilters(new HttpExceptionFilter())
  findOneAddress(@Param() param: { id: string }) {
    return this.client.send(
      'topic-rider-address-findOneAddress',
      `${JSON.stringify({ param })}`,
    ); // args - topic, message
  }

  // update route for rider address
  @UseGuards(AuthGuard)
  @Patch('/address/updateAddress/:id')
  @Roles('Rider')
  @UseFilters(new HttpExceptionFilter())
  updateAddressByRider(
    @Req() req,
    @Body() body: UpdateAddressByRiderDTO,
    @Param() param: { id: string },
  ) {
    const { id } = req.user;
    return this.client.send(
      'topic-rider-address-updateAddress',
      `${JSON.stringify({ id, param, body })}`,
    ); // args - topic, message
  }

  // create compliance if new entry and update compliance if same day entry route
  @UseGuards(AuthGuard)
  @Post('/compliance')
  @Roles('Rider')
  @UseFilters(new HttpExceptionFilter())
  createCompliance(
    @Req() req,
    @Body() body: UploadComplianceDocumentsRiderDTO,
  ) {
    const { id } = req.user;
    return this.client.send(
      'topic-rider-compliance-createCompliance',
      `${JSON.stringify({ id, body })}`,
    ); // args - topic, message
  }

  // create random compliance route
  @UseGuards(AuthGuard)
  @Post('/randomCompliance')
  @Roles('Rider')
  @UseFilters(new HttpExceptionFilter())
  randomCompliance(
    @Req() req,
    @Body() body: UploadComplianceDocumentsRiderDTO,
  ) {
    const { id } = req.user;
    return this.client.send(
      'topic-rider-compliance-randomCompliance',
      `${JSON.stringify({ id, body })}`,
    ); // args - topic, message
  }

  // request compliance route
  @UseGuards(AuthGuard)
  @Post('/requestCompliance')
  @Roles('SuperAdmin', 'Admin', 'RiderComplianceManagement')
  @UseFilters(new HttpExceptionFilter())
  requestComplianceByAdmin(@Body() body: RequestComplianceDocumentsRiderDTO) {
    const complianceObserver = this.client.send(
      'topic-rider-compliance-requestComplianceByAdmin',
      `${JSON.stringify({ body })}`,
    ); // args - topic, message

    const promise1 = new Promise<any>((resolve, reject) => {
      complianceObserver.pipe(take(1)).subscribe((result: any) => {
        if (result.message === 'RIDER_S5001') {
          resolve(
            {
              notification: this.client.send(
                'topic-notification-notifications-createNotification',
                `${JSON.stringify({
                  id: body.riderId,
                  notification: {
                    title: 'Requested Random Compliance!',
                    body: `Your compliance has beed requested again. `,
                  },
                  android: { priority: 'high' },
                  data: {
                    type: 'RIDER_RANDOM_COMPLIANCE_REQUEST',
                    title: 'Requested Random Compliance!',
                    body: `Your compliance has beed requested again. `,
                  },
                  apns: {
                    payload: {
                      aps: {
                        alert: {
                          title: 'Requested Random Compliance!',
                          body: `Your compliance has beed requested again. `,
                        },
                        sound: 'default',
                        mutableContent: 1,
                        contentAvailable: 1,
                      },
                    },
                  },
                })}`,
              ),
              result,
            }, // args - topic, message
          );
        } else {
          resolve({
            result,
          });
        }
      });
    });

    return promise1.then((notificationObserver) => {
      const promise2 = new Promise<void>((resolve, reject) => {
        if (notificationObserver.notification) {
          notificationObserver.notification
            .pipe(take(1))
            .subscribe((result: any) => {
              resolve();
            });
        }
        resolve();
      });
      return promise2.then(() => notificationObserver.result);
    });
  }

  // update compliance status and rating
  @UseGuards(AuthGuard)
  @Patch('/compliance/update/:id')
  @Roles('Admin', 'SuperAdmin', 'RiderComplianceManagement')
  @UseFilters(new HttpExceptionFilter())
  updateCompliance(
    @Req() req,
    @Body() body: UpdateComplianceRiderDTO,
    @Param() param: { id: string },
  ) {
    const { id } = req.user;
    return this.client.send(
      'topic-rider-compliance-updateCompliance',
      `${JSON.stringify({ id, param, body })}`,
    ); // args - topic, message
  }

  // find one compliance
  @UseGuards(AuthGuard)
  @Get('/compliance/find/:id')
  @Roles('Admin', 'SuperAdmin', 'RiderComplianceManagement')
  @UseFilters(new HttpExceptionFilter())
  findOneCompliance(@Param() param: { id: string }) {
    return this.client.send(
      'topic-rider-compliance-findOneCompliance',
      `${JSON.stringify({ param })}`,
    ); // args - topic, message
  }

  // find all compliance
  @UseGuards(AuthGuard)
  @Get('/compliance')
  @Roles('Admin', 'SuperAdmin', 'RiderComplianceManagement')
  @UseFilters(new HttpExceptionFilter())
  findAllCompliance(@Query() query: CompliancePaginationQueryDTO) {
    return this.client.send(
      'topic-rider-compliance-findAllCompliance',
      `${JSON.stringify({ query })}`,
    ); // args - topic, message
  }

  // create financial assistance for a rider route
  @UseGuards(AuthGuard)
  @Post('/financialAssistance')
  @Roles('Rider')
  @UseFilters(new HttpExceptionFilter())
  createFinancialAssistance(
    @Req() req,
    @Body() body: CreateFinancialAssistanceDTO,
  ) {
    const { id } = req.user;
    return this.client.send(
      'topic-rider-financialAssistance-createFinancialAssistance',
      `${JSON.stringify({ id, body })}`,
    ); // args - topic, message
  }

  // search financial assistance for a rider route
  @UseGuards(AuthGuard)
  @Get('/financialAssistance')
  @Roles('Rider')
  @UseFilters(new HttpExceptionFilter())
  findAllFinancialAssistances(@Req() req, @Query() query: PaginationQueryDTO) {
    const { id } = req.user;
    return this.client.send(
      'topic-rider-financialAssistance-findAllFinancialAssistances',
      `${JSON.stringify({ id, query })}`,
    ); // args - topic, message
  }

  // create a new Rider with a temporary password that he can change later
  @UseGuards(AuthGuard)
  @Post('/shiftManagement')
  @Roles('Admin', 'SuperAdmin')
  @UseFilters(new HttpExceptionFilter())
  createRiderShift(@Req() req, @Body() body: CreateShiftDTO) {
    const { id } = req.user;
    return this.client.send(
      'topic-rider-shift-createShifts',
      `${JSON.stringify({ id, body })}`,
    ); // args - topic, message
  }

  // create a new Rider with a temporary password that he can change later
  @UseGuards(AuthGuard)
  @Get('/shiftManagement')
  @Roles('Admin', 'SuperAdmin', 'Rider')
  @UseFilters(new HttpExceptionFilter())
  gatAllRiderShift(@Req() req, @Query() query: PaginationQueryDTO) {
    const { id, role } = req.user;
    return this.client.send(
      'topic-rider-shift-findAllShifts',
      `${JSON.stringify({ id, role, query })}`,
    ); // args - topic, message
  }

  // create a new Rider with a temporary password that he can change later
  @UseGuards(AuthGuard)
  @Get('/shiftManagement/:id')
  @Roles('Admin', 'SuperAdmin')
  @UseFilters(new HttpExceptionFilter())
  findOneShift(@Param() param: { id: string }) {
    return this.client.send(
      'topic-rider-shift-findOneShift',
      `${JSON.stringify({ param })}`,
    ); // args - topic, message
  }

  // create a new Rider with a temporary password that he can change later
  @UseGuards(AuthGuard)
  @Patch('/shiftManagement/:id')
  @Roles('Admin', 'SuperAdmin')
  @UseFilters(new HttpExceptionFilter())
  updateShift(
    @Param() param: { id: string },
    @Body() body: UpdateShiftToRiderDTO,
  ) {
    return this.client.send(
      'topic-rider-shift-updateShift',
      `${JSON.stringify({ param, body })}`,
    ); // args - topic, message
  }

  // create a new Rider with a temporary password that he can change later
  @UseGuards(AuthGuard)
  @Patch('/shiftManagement/assigShiftToRider/:id')
  @Roles('Admin', 'SuperAdmin')
  @UseFilters(new HttpExceptionFilter())
  assigShiftToRider(
    @Param() param: { id: string },
    @Body() body: AssignShiftToRiderDTO,
  ) {
    return this.client.send(
      'topic-rider-shift-assigShiftToRider',
      `${JSON.stringify({ param, body })}`,
    ); // args - topic, message
  }

  // upload document
  @UseGuards(AuthGuard)
  @Post('/document/uploadDocument')
  @Roles('Rider')
  @UseFilters(new HttpExceptionFilter())
  uploadDocument(@Req() req, @Body() body: UploadDocumentDTO) {
    const { id } = req.user;
    return this.client.send(
      'topic-rider-document-uploadDocument',
      `${JSON.stringify({ riderId: id, body })}`,
    ); // args - topic, message
  }

  // update document
  @UseGuards(AuthGuard)
  @Patch('/document/update/:id')
  @Roles('Rider')
  @UseFilters(new HttpExceptionFilter())
  updateDocument(
    @Param() param: { id: string },
    @Body() body: UpdateDocumentDTO,
  ) {
    return this.client.send(
      'topic-rider-document-updateDocument',
      `${JSON.stringify({ param, body })}`,
    ); // args - topic, message
  }

  // find by rider Id document
  @UseGuards(AuthGuard)
  @Get('/document/findByRider')
  @Roles('Rider')
  @UseFilters(new HttpExceptionFilter())
  findByRiderDocument(@Req() req) {
    const { id } = req.user;
    return this.client.send(
      'topic-rider-document-findByRiderDocument',
      `${JSON.stringify({ id })}`,
    ); // args - topic, message
  }

  // find all document
  @UseGuards(AuthGuard)
  @Get('/document')
  @Roles('SuperAdmin', 'Admin', 'RiderManagement')
  @UseFilters(new HttpExceptionFilter())
  findAllDocument(@Query() query: DocumentPaginationQueryDTO) {
    return this.client.send(
      'topic-rider-document-findAllDocument',
      `${JSON.stringify({ query })}`,
    ); // args - topic, message
  }

  // find one document
  @UseGuards(AuthGuard)
  @Get('/document/find/:id')
  @Roles('SuperAdmin', 'Admin', 'RiderManagement')
  @UseFilters(new HttpExceptionFilter())
  findOneDocument(@Param() param: { id: string }) {
    return this.client.send(
      'topic-rider-document-findOneDocument',
      `${JSON.stringify({ param })}`,
    ); // args - topic, message
  }

  // verify one document
  @UseGuards(AuthGuard)
  @Patch('/document/verify/:id')
  @Roles('SuperAdmin', 'Admin', 'RiderManagement')
  @UseFilters(new HttpExceptionFilter())
  verifyDocument(
    @Param() param: { id: string },
    @Body() body: VerifyDocumentDTO,
  ) {
    if (body.status === 'REJECTED') {
      const documentObserver = this.client.send(
        'topic-rider-document-verifyDocument',
        `${JSON.stringify({ param, body })}`,
      ); // args - topic, message

      const promise1 = new Promise<any>((resolve, reject) => {
        documentObserver.pipe(take(1)).subscribe((result: any) => {
          resolve(
            {
              notification: this.client.send(
                'topic-notification-notifications-createNotification',
                `${JSON.stringify({
                  id: result.body.riderId,
                  notification: {
                    title: 'Document Rejected!',
                    body: `Your document has been rejected please upload again. `,
                  },
                  android: { priority: 'high' },
                  data: {
                    type: 'RIDER_DOCUMENT_REJECTED',
                    title: 'Document Rejected!',
                    body: `Your document has been rejected please upload again. `,
                  },
                  apns: {
                    payload: {
                      aps: {
                        alert: {
                          title: 'Document Rejected!',
                          body: `Your document has been rejected please upload again. `,
                        },
                        sound: 'default',
                        mutableContent: 1,
                        contentAvailable: 1,
                      },
                    },
                  },
                })}`,
              ),
              result,
            }, // args - topic, message
          );
        });
      });

      return promise1.then((notificationObserver) => {
        const promise2 = new Promise<void>((resolve, reject) => {
          notificationObserver.notification
            .pipe(take(1))
            .subscribe((result: any) => {
              resolve();
            });
        });
        return promise2.then(() => notificationObserver.result);
      });
    } else {
      return this.client.send(
        'topic-rider-document-verifyDocument',
        `${JSON.stringify({ param, body })}`,
      ); // args - topic, message
    }
  }
}
