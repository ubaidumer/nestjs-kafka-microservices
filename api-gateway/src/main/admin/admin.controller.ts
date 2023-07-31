import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseFilters,
  UseGuards,
  Query,
} from '@nestjs/common';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';
import {
  AdminPaginationQueryDTO,
  CreatAdminDTO,
  GoogleLoginDTO,
  LogInDTO,
  UpdateAdminDTO,
} from 'src/dto/admin/auth.dto';
import { Roles } from 'src/role.decorator';
import { AuthGuard } from 'src/auth.guard';
import { HttpExceptionFilter } from 'src/utils/exceptionFilter';
import {
  CreateAddressDTO,
  UpdateAddressDTO,
} from 'src/dto/customer/address.dto';
import {
  CreateCampaignDTO,
  UpdateCampaignDTO,
} from 'src/dto/admin/campaign.dto';
import { Kafka } from 'kafkajs';

import { adminTopicArray } from 'src/utils/constant/adminConstants';
import { PaginationQueryDTO } from 'src/dto/customer/common.dto';
import { configService } from 'src/config/config';

// Routes for auth Api's
@Controller('admins')
export class AdminController {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}
  @Client({
    transport: Transport.KAFKA,
    options: {
      client: configService.getKafkaClientConfig('AdminClient'),
      consumer: {
        groupId: 'ADMIN_CONSUMER', // Should be the same thing we give in consumer
        allowAutoTopicCreation: true,
      },
    },
  })
  client: ClientKafka;

  async kafkaAdminCreateTopic() {
    const kafka = new Kafka(configService.getKafkaClientConfig('AdminClient'));
    var admin = kafka.admin();

    // create new topic
    await admin.createTopics({
      waitForLeaders: true,
      topics: adminTopicArray,
    });

    // list all topics
    // const topics = await admin.listTopics();
    // console.log(topics);
  }

  async onModuleInit() {
    await this.kafkaAdminCreateTopic();

    // Need to subscribe to topic
    // so that we can get the response from kafka microservice

    adminTopicArray.forEach((element) => {
      this.client.subscribeToResponseOf(element.topic);
    });

    this.client.connect();
    // console.log('');
  }

  // create a new Admin with a temporary password that he can change later
  @UseGuards(AuthGuard)
  @Post('')
  @Roles('Admin', 'SuperAdmin', 'OperatorManagement')
  @UseFilters(new HttpExceptionFilter())
  createAdmin(@Body() body: CreatAdminDTO) {
    return this.client.send(
      'topic-admin-auth-createAdmin',
      `${JSON.stringify({ body })}`,
    ); // args - topic, message
  }

  // update admin
  @UseGuards(AuthGuard)
  @Patch('/:id')
  @Roles('Admin', 'SuperAdmin', 'OperatorManagement')
  @UseFilters(new HttpExceptionFilter())
  updateAdmin(@Body() body: UpdateAdminDTO, @Param() id: string) {
    return this.client.send(
      'topic-admin-auth-updateAdmin',
      `${JSON.stringify({ id, body })}`,
    ); // args - topic, message
  }

  //'topic-admin-auth-updateAdmin'
  // get admin detail by admin id
  @UseGuards(AuthGuard)
  @Get('findAdmin')
  @UseFilters(new HttpExceptionFilter())
  @Roles('Admin', 'SuperAdmin', 'OperatorManagement')
  getAdminDetail(@Req() req) {
    const { id } = req.user;
    return this.client.send(
      'topic-admin-auth-getAdminDetail',
      `${JSON.stringify({ id })}`,
    ); // args - topic, message
  }

  // find admins/operators
  @UseGuards(AuthGuard)
  @Get('')
  @UseFilters(new HttpExceptionFilter())
  @Roles('Admin', 'SuperAdmin', 'OperatorManagement')
  findAllAdmin(@Query() query: AdminPaginationQueryDTO) {
    return this.client.send(
      'topic-admin-auth-findAllAdmin',
      `${JSON.stringify({ query })}`,
    ); // args - topic, message
  }

  // authenticate admin by email,password login route
  @Post('/logIn')
  @UseFilters(new HttpExceptionFilter())
  adminLogIn(@Body() body: LogInDTO) {
    return this.client.send(
      'topic-admin-auth-adminLogIn',
      `${JSON.stringify({ body })}`,
    ); // args - topic, message
  }

  // authenticate admin by google signup/login route
  @Post('/googleLogin')
  @UseFilters(new HttpExceptionFilter())
  adminGoogleRegisteration(@Body() body: GoogleLoginDTO) {
    return this.client.send(
      'topic-admin-auth-adminGoogleRegisteration',
      `${JSON.stringify({ body })}`,
    ); // args - topic, message
  }

  // Address is added by admin route
  @UseGuards(AuthGuard)
  @Post('/address')
  @Roles('Admin', 'SuperAdmin')
  @UseFilters(new HttpExceptionFilter())
  createAddress(@Req() req, @Body() body: CreateAddressDTO) {
    const { id } = req.user;
    return this.client.send(
      'topic-admin-address-createAddress',
      `${JSON.stringify({ id, body })}`,
    ); // args - topic, message
  }

  // find all admin Addresses route
  @UseGuards(AuthGuard)
  @Get('/address')
  @Roles('Admin', 'SuperAdmin')
  @UseFilters(new HttpExceptionFilter())
  findAllAddress(@Query() query: PaginationQueryDTO) {
    return this.client.send(
      'topic-admin-address-findAllAddress',
      `${JSON.stringify({ query })}`,
    ); // args - topic, message
  }

  // find one admin address using Address id route
  @UseGuards(AuthGuard)
  @Get('/address/find/:id')
  @Roles('Admin', 'SuperAdmin')
  @UseFilters(new HttpExceptionFilter())
  findOneAddress(@Param() param: { id: string }) {
    return this.client.send(
      'topic-admin-address-findOneAddress',
      `${JSON.stringify({ param })}`,
    ); // args - topic, message
  }

  // find one admin all address using admin id route
  @UseGuards(AuthGuard)
  @Get('/address/findAdmin')
  @Roles('Admin', 'SuperAdmin')
  @UseFilters(new HttpExceptionFilter())
  findOneAdminAllAddress(@Req() req, @Query() query: PaginationQueryDTO) {
    const { id } = req.user;
    return this.client.send(
      'topic-admin-address-findOneAdminAllAddress',
      `${JSON.stringify({ id, query })}`,
    ); // args - topic, message
  }

  // update one admin Address using Address id route
  @UseGuards(AuthGuard)
  @Patch('/address/update/:id')
  @Roles('Admin', 'SuperAdmin')
  @UseFilters(new HttpExceptionFilter())
  updateAddress(
    @Body() body: UpdateAddressDTO,
    @Param() param: { id: string },
  ) {
    return this.client.send(
      'topic-admin-address-updateAddress',
      `${JSON.stringify({ body, param })}`,
    ); // args - topic, message
  }

  // Campaign is added by admin route
  @UseGuards(AuthGuard)
  @Post('/campaign')
  @Roles('Admin', 'SuperAdmin')
  @UseFilters(new HttpExceptionFilter())
  createCampaign(@Req() req, @Body() body: CreateCampaignDTO) {
    const { id } = req.user;
    return this.client.send(
      'topic-admin-campaign-createCampaign',
      `${JSON.stringify({ id, body })}`,
    ); // args - topic, message
  }

  // find all campaigns route
  @UseGuards(AuthGuard)
  @Get('/campaign')
  @Roles('Admin', 'SuperAdmin')
  @UseFilters(new HttpExceptionFilter())
  findAllCampaign(@Query() query: PaginationQueryDTO) {
    return this.client.send(
      'topic-admin-campaign-findAllCampaign',
      `${JSON.stringify({ query })}`,
    ); // args - topic, message
  }

  // find one campaign using campaign id route
  @UseGuards(AuthGuard)
  @Get('/campaign/find/:id')
  @Roles('Admin', 'SuperAdmin')
  @UseFilters(new HttpExceptionFilter())
  findOneCampaign(@Param() param: { id: string }) {
    return this.client.send(
      'topic-admin-campaign-findOneCampaign',
      `${JSON.stringify({ param })}`,
    ); // args - topic, message
  }

  // find one admin all campaigns using admin id route
  @UseGuards(AuthGuard)
  @Get('/campaign/findAdmin')
  @Roles('Admin', 'SuperAdmin')
  @UseFilters(new HttpExceptionFilter())
  findOneAdminAllCampaign(@Req() req, @Query() query: PaginationQueryDTO) {
    const { id } = req.user;
    return this.client.send(
      'topic-admin-campaign-findOneAdminAllCampaign',
      `${JSON.stringify({ id, query })}`,
    ); // args - topic, message
  }

  // update one campaign using campaign id route
  @UseGuards(AuthGuard)
  @Patch('/campaign/update/:id')
  @Roles('Admin', 'SuperAdmin')
  @UseFilters(new HttpExceptionFilter())
  updateCampaign(
    @Body() body: UpdateCampaignDTO,
    @Param() param: { id: string },
  ) {
    return this.client.send(
      'topic-admin-campaign-updateCampaign',
      `${JSON.stringify({ body, param })}`,
    ); // args - topic, message
  }
}
