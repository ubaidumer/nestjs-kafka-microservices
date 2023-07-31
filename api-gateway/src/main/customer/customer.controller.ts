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
import { Request } from 'express';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';
import {
  GuestOnboardingDTO,
  SendOtpDTO,
  UserOnboardingByAdminDTO,
  UserOnboardingDTO,
  VerifyOtpDTO,
} from 'src/dto/customer/auth.dto';
import { Roles } from 'src/role.decorator';
import { AuthGuard } from 'src/auth.guard';
import { HttpExceptionFilter } from 'src/utils/exceptionFilter';
import {
  CustomerPaginationQueryDTO,
  UpdateCustomerDTO,
  UpdateCustomerStatusDTO,
} from 'src/dto/customer/customer.dto';
import {
  CreateAddressDTO,
  UpdateAddressDTO,
} from 'src/dto/customer/address.dto';
import { CreateCustomerAffairDTO } from 'src/dto/customer/customer-affair.dto';
import { CreateCustomerFavDTO } from 'src/dto/customer/customer-fav.dto';
import { PaginationQueryDTO } from 'src/dto/customer/common.dto';
import { Kafka } from 'kafkajs';

import { customerTopicArray } from 'src/utils/constant/customerConstant';
import { configService } from 'src/config/config';
const DeviceDetector = require('node-device-detector');

// Routes for auth Api's
@Controller('customers')
export class CustomerController {
  constructor() {}
  @Client({
    transport: Transport.KAFKA,
    options: {
      client: configService.getKafkaClientConfig('CustomerClient'),
      consumer: {
        groupId: 'CUSTOMER_CONSUMER', // Should be the same thing we give in consumer
        allowAutoTopicCreation: true,
      },
    },
  })
  client: ClientKafka;

  async kafkaAdminCreateTopic() {
    const kafka = new Kafka(
      configService.getKafkaClientConfig('CustomerClient'),
    );
    var admin = kafka.admin();

    // create new topic
    await admin.createTopics({
      waitForLeaders: true,
      topics: customerTopicArray,
    });

    // list all topics
    // const topics = await admin.listTopics();
    // console.log(topics);
  }

  async onModuleInit() {
    await this.kafkaAdminCreateTopic();

    // Need to subscribe to topic
    // so that we can get the response from kafka microservice

    customerTopicArray.forEach((element) => {
      this.client.subscribeToResponseOf(element.topic);
    });

    this.client.connect();
  }

  // authenticate guest user by skipping signup/login route
  @Get('/skip')
  guestRegisteration(@Req() req: Request) {
    const request = this.requestInfo(req, 'Guest');
    return this.client.send(
      'topic-customer-auth-guestRegisteration',
      `${JSON.stringify({ request })}`,
    ); // args - topic, message
  }

  // signup route for guest type customer
  @UseGuards(AuthGuard)
  @Post('/signupGuest')
  @Roles('Guest')
  @UseFilters(new HttpExceptionFilter())
  guestOnboarding(@Req() req: Request, @Body() body: GuestOnboardingDTO) {
    body['customerType'] = 'Authorized';
    const id = (req.user as any).id;
    return this.client.send(
      'topic-customer-auth-guestOnboarding',
      `${JSON.stringify({ id, body })}`,
    ); // args - topic, message
  }

  // signup route for authorized type customer
  @Post('/signupCustomer')
  @UseFilters(new HttpExceptionFilter())
  userOnboarding(@Req() req: Request, @Body() body: UserOnboardingDTO) {
    const request = this.requestInfo(req, 'Authorized');
    return this.client.send(
      'topic-customer-auth-userOnboarding',
      `${JSON.stringify({ request, body })}`,
    ); // args - topic, message
  }

  // signup route for authorized type customer by admin actions
  @UseGuards(AuthGuard)
  @Post('/signupCustomerByAdmin')
  @Roles('Admin', 'SuperAdmin', 'CustomerManagement', 'OrderManagement')
  @UseFilters(new HttpExceptionFilter())
  userOnboardingByAdmin(@Body() body: UserOnboardingByAdminDTO) {
    body['customerType'] = 'Guest';
    return this.client.send(
      'topic-customer-auth-userOnboardingByAdmin',
      `${JSON.stringify({ body })}`,
    ); // args - topic, message
  }

  // send otp phone number route for customer
  @Post('/sendOTP')
  @UseFilters(new HttpExceptionFilter())
  sendOtp(@Body() body: SendOtpDTO) {
    return this.client.send(
      'topic-customer-auth-sendOtp',
      `${JSON.stringify({ body })}`,
    ); // args - topic, message
  }

  // verify otp phone number route for customer
  @Post('/verifyOTP')
  @UseFilters(new HttpExceptionFilter())
  verifyOtp(@Body() body: VerifyOtpDTO) {
    return this.client.send(
      'topic-customer-auth-verifyOtp',
      `${JSON.stringify({ body })}`,
    );
  }

  // search route for customer by admin
  @UseGuards(AuthGuard)
  @Get()
  @Roles('Admin', 'SuperAdmin', 'CustomerManagement')
  @UseFilters(new HttpExceptionFilter())
  findAllCustomer(@Query() query: CustomerPaginationQueryDTO) {
    return this.client.send(
      'topic-customer-auth-findAllCustomer',
      `${JSON.stringify({ query })}`,
    ); // args - topic, message
  }

  // search by customer id route for customer
  @UseGuards(AuthGuard)
  @Get('/find/:id')
  @Roles('Customer', 'Admin', 'SuperAdmin', 'CustomerManagement')
  @UseFilters(new HttpExceptionFilter())
  findOneCustomer(@Param() param: { id: string }) {
    return this.client.send(
      'topic-customer-auth-findOneCustomer',
      `${JSON.stringify({ param })}`,
    ); // args - topic, message
  }

  // search by customer phone no route for customer
  @UseGuards(AuthGuard)
  @Get('/findByPhone/:phoneNo')
  @Roles('Admin', 'SuperAdmin', 'CustomerManagement')
  @UseFilters(new HttpExceptionFilter())
  findOneCustomerByPhone(@Param() param: { phoneNo: string }) {
    return this.client.send(
      'topic-customer-auth-findOneCustomerByPhone',
      `${JSON.stringify({ param })}`,
    ); // args - topic, message
  }

  // update by customer id route for customer
  @UseGuards(AuthGuard)
  @Patch('/update/:id')
  @Roles('Customer', 'Admin', 'SuperAdmin')
  @UseFilters(new HttpExceptionFilter())
  updateCustomer(
    @Param() param: { id: string },
    @Body() body: UpdateCustomerDTO,
  ) {
    return this.client.send(
      'topic-customer-auth-updateCustomer',
      `${JSON.stringify({ param, body })}`,
    ); // args - topic, message
  }

  // update by customer id route for customer
  @UseGuards(AuthGuard)
  @Patch('/status/update/:id')
  @Roles('Admin', 'SuperAdmin', 'CustomerManagement')
  @UseFilters(new HttpExceptionFilter())
  updateCustomerStatus(
    @Param() param: { id: string },
    @Body() body: UpdateCustomerStatusDTO,
  ) {
    return this.client.send(
      'topic-customer-auth-updateCustomerStatus',
      `${JSON.stringify({ param, body })}`,
    ); // args - topic, message
  }

  // create route for customer address
  @UseGuards(AuthGuard)
  @Post('/address')
  @Roles('Customer')
  @UseFilters(new HttpExceptionFilter())
  createAddress(@Body() body: CreateAddressDTO, @Req() req) {
    const { id } = req.user;
    return this.client.send(
      'topic-customer-address-createAddress',
      `${JSON.stringify({ body: { customerId: id, ...body } })}`,
    ); // args - topic, message
  }

  // find all customer addresses by admin route
  @UseGuards(AuthGuard)
  @Get('/address')
  @Roles('Admin', 'SuperAdmin', 'CustomerManagement')
  @UseFilters(new HttpExceptionFilter())
  findAllAddress(@Query() query: PaginationQueryDTO) {
    return this.client.send(
      'topic-customer-address-findAllAddress',
      `${JSON.stringify({ query })}`,
    ); // args - topic, message
  }

  // find one customer address using address id route
  @UseGuards(AuthGuard)
  @Get('/address/find/:id')
  @Roles('Admin', 'SuperAdmin', 'CustomerManagement')
  @UseFilters(new HttpExceptionFilter())
  findOneAddress(@Param() param: { id: string }) {
    return this.client.send(
      'topic-customer-address-findOneAddress',
      `${JSON.stringify({ param })}`,
    ); // args - topic, message
  }

  // find one customers all addresses using customer id route
  @UseGuards(AuthGuard)
  @Get('/address/findcustomer')
  @Roles('Customer')
  @UseFilters(new HttpExceptionFilter())
  findOneCustomerAllAddress(@Req() req, @Query() query: PaginationQueryDTO) {
    const { id } = req.user;
    return this.client.send(
      'topic-customer-address-findOneCustomerAllAddress',
      `${JSON.stringify({ id, query })}`,
    ); // args - topic, message
  }

  // update one  customer address using address id route
  @UseGuards(AuthGuard)
  @Patch('/address/update/:id')
  @Roles('Customer')
  @UseFilters(new HttpExceptionFilter())
  updateAddress(
    @Req() req,
    @Body() body: UpdateAddressDTO,
    @Param() param: { id: string },
  ) {
    const { id } = req.user;
    return this.client.send(
      'topic-customer-address-updateAddress',
      `${JSON.stringify({ id, param, body })}`,
    ); // args - topic, message
  }

  // create route for customer Affair
  @UseGuards(AuthGuard)
  @Post('/customerAffair')
  @Roles('Customer')
  @UseFilters(new HttpExceptionFilter())
  createCustomerAffair(@Req() req, @Body() body: CreateCustomerAffairDTO) {
    const { id } = req.user;
    return this.client.send(
      'topic-customer-affair-createAffair',
      `${JSON.stringify({ id, body })}`,
    ); // args - topic, message
  }

  // search route for customer Affair
  @UseGuards(AuthGuard)
  @Get('/customerAffair')
  @Roles('Admin', 'SuperAdmin', 'CustomerManagement')
  @UseFilters(new HttpExceptionFilter())
  findAllCustomerAffair(@Query() query: PaginationQueryDTO) {
    return this.client.send(
      'topic-customer-affair-findAllAffair',
      `${JSON.stringify({ query })}`,
    ); // args - topic, message
  }

  // search by customer Affair id route for customer Affair
  @UseGuards(AuthGuard)
  @Get('/customerAffair/find/:id')
  @Roles('Admin', 'SuperAdmin', 'CustomerManagement')
  @UseFilters(new HttpExceptionFilter())
  findOneCustomerAffair(@Param() param: { id: string }) {
    return this.client.send(
      'topic-customer-affair-findOneAffair',
      `${JSON.stringify({ param })}`,
    ); // args - topic, message
  }

  // search by customer id route for customer Affair
  @UseGuards(AuthGuard)
  @Get('/customerAffair/findcustomer')
  @Roles('Customer')
  @UseFilters(new HttpExceptionFilter())
  findOneCustomerAllCustomerAffair(
    @Req() req,
    @Query() query: PaginationQueryDTO,
  ) {
    const { id } = req.user;
    return this.client.send(
      'topic-customer-affair-findOneCustomerAllAffair',
      `${JSON.stringify({ id, query })}`,
    ); // args - topic, message
  }

  // delete route for customer Affair
  @UseGuards(AuthGuard)
  @Delete('/customerAffair/delete/:id')
  @Roles('Customer', 'Admin', 'SuperAdmin', 'CustomerManagement')
  @UseFilters(new HttpExceptionFilter())
  deleteCustomerAffair(@Param() param: { id: string }) {
    return this.client.send(
      'topic-customer-affair-deleteAffair',
      `${JSON.stringify({ param })}`,
    ); // args - topic, message
  }
  // create route for customer Fav
  @UseGuards(AuthGuard)
  @Post('/customerFav')
  @Roles('Customer')
  @UseFilters(new HttpExceptionFilter())
  createCustomerFav(@Req() req, @Body() body: CreateCustomerFavDTO) {
    const { id } = req.user;
    return this.client.send(
      'topic-customer-fav-createFav',
      `${JSON.stringify({ id, body })}`,
    ); // args - topic, message
  }

  // search route for customer Fav
  @UseGuards(AuthGuard)
  @Get('/customerFav')
  @Roles('Admin', 'SuperAdmin', 'CustomerManagement')
  @UseFilters(new HttpExceptionFilter())
  findAllCustomerFav(@Query() query: PaginationQueryDTO) {
    return this.client.send(
      'topic-customer-fav-findAllFav',
      `${JSON.stringify({ query })}`,
    ); // args - topic, message
  }

  // search by customer Fav id route for customer Fav
  @UseGuards(AuthGuard)
  @Get('/customerFav/find/:id')
  @Roles('Admin', 'SuperAdmin', 'CustomerManagement')
  @UseFilters(new HttpExceptionFilter())
  findOneCustomerFav(@Param() param: { id: string }) {
    return this.client.send(
      'topic-customer-fav-findOneFav',
      `${JSON.stringify({ param })}`,
    ); // args - topic, message
  }

  // search by customer id route for customer Fav
  @UseGuards(AuthGuard)
  @Get('/customerFav/findcustomer')
  @Roles('Customer')
  @UseFilters(new HttpExceptionFilter())
  findOneCustomerAllCustomerFav(
    @Req() req,
    @Query() query: PaginationQueryDTO,
  ) {
    const { id } = req.user;
    return this.client.send(
      'topic-customer-fav-findOneCustomerAllFav',
      `${JSON.stringify({ id, query })}`,
    ); // args - topic, message
  }

  // delete route for customer Fav
  @UseGuards(AuthGuard)
  @Delete('/customerFav/delete/:id')
  @Roles('Customer')
  @UseFilters(new HttpExceptionFilter())
  deleteCustomerFav(@Param() param: { id: string }) {
    return this.client.send(
      'topic-customer-fav-deleteFav',
      `${JSON.stringify({ param })}`,
    ); // args - topic, message
  }

  // util functions

  // device dectector function for OS,Client and device information
  requestInfo(req, type) {
    const detector = new DeviceDetector({
      clientIndexes: true,
      deviceIndexes: true,
      deviceAliasCode: false,
    });
    const userAgent = req.headers['user-agent'];
    const result = detector.detect(userAgent);

    let body = {};
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    body['ipAddress'] = ip;
    body['customerType'] = type;
    body['osInfo'] = result.os;
    body['deviceInfo'] = result.device;
    body['clientInfo'] = result.client;
    return body;
  }
}
