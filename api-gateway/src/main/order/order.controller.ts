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
import { take } from 'rxjs';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';
import { Roles } from 'src/role.decorator';
import { AuthGuard } from 'src/auth.guard';
import { HttpExceptionFilter } from 'src/utils/exceptionFilter';
const DeviceDetector = require('node-device-detector');
import {
  FeedbackDTO,
  FeedbackPaginationQueryDTO,
} from 'src/dto/order/feedback.dto';
import {
  OrderActivePaginationQueryDTO,
  OrderDTO,
  OrderPaginationQueryDTO,
  rejectByRider,
  updateOrderBYAdminDTO,
} from 'src/dto/order/order.dto';
import { Kafka } from 'kafkajs';
import { ConfigurationDTO, PaginationQueryDTO } from 'src/dto/order/common.dto';
import { configService } from 'src/config/config';
import { orderTopicArray } from 'src/utils/constant/orderConstants';
import {
  PaymentDTO,
  PaymentPaginationQueryDTO,
} from 'src/dto/order/payment.dto';

// Routes for auth Api's
@Controller('orders')
export class OrderController {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}
  @Client({
    transport: Transport.KAFKA,
    options: {
      client: configService.getKafkaClientConfig('OrderClient'),
      consumer: {
        groupId: 'ORDER_CONSUMER', // Should be the same thing we give in consumer
        allowAutoTopicCreation: true,
      },
    },
  })
  client: ClientKafka;

  async kafkaAdminCreateTopic() {
    const kafka = new Kafka(configService.getKafkaClientConfig('OrderClient'));
    var admin = kafka.admin();

    // create new topic
    await admin.createTopics({
      waitForLeaders: true,
      topics: orderTopicArray,
    });

    // list all topics
    // const topics = await admin.listTopics();
    // console.log(topics);
  }

  async onModuleInit() {
    await this.kafkaAdminCreateTopic();

    // Need to subscribe to topic
    // so that we can get the response from kafka microservice

    orderTopicArray.forEach((element) => {
      this.client.subscribeToResponseOf(element.topic);
    });

    this.client.connect();
  }

  // ManualAccceptance

  // create route for Configuration
  @UseGuards(AuthGuard)
  @Post('/configuration')
  @Roles('SuperAdmin', 'Admin')
  @UseFilters(new HttpExceptionFilter())
  createConfiguration(@Body() body) {
    return this.client.send(
      'topic-order-configuration-createConfiguration',
      `${JSON.stringify({ body })}`,
    ); // args - topic, message
  }

  // create route for Configuration
  @UseGuards(AuthGuard)
  @Get('/findConfiguration')
  @Roles('SuperAdmin', 'Admin')
  @UseFilters(new HttpExceptionFilter())
  findOneConfiguration() {
    return this.client.send(
      'topic-order-configuration-findConfiguration',
      `No data`,
    ); // args - topic, message
  }

  // create route for Configuration
  @UseGuards(AuthGuard)
  @Patch('/configuration/update/:id')
  @Roles('SuperAdmin', 'Admin')
  @UseFilters(new HttpExceptionFilter())
  updateConfiguration(
    @Param() param: { id: string },
    @Body() body: ConfigurationDTO,
  ) {
    return this.client.send(
      'topic-order-configuration-updateConfiguration',
      `${JSON.stringify({ param, body })}`,
    ); // args - topic, message
  }
  // feetback routes...

  // create route for feedback
  @UseGuards(AuthGuard)
  @Post('/feedback')
  @Roles('Customer')
  @UseFilters(new HttpExceptionFilter())
  createFeedback(@Req() req, @Body() body: FeedbackDTO) {
    const { id } = req.user;
    return this.client.send(
      'topic-order-feedback-createFeedback',
      `${JSON.stringify({ id, body })}`,
    ); // args - topic, message
  }

  // find all feedback route
  @UseGuards(AuthGuard)
  @Get('/feedback')
  @Roles('SuperAdmin', 'Admin')
  @UseFilters(new HttpExceptionFilter())
  findAllFeedback(@Query() query: FeedbackPaginationQueryDTO) {
    return this.client.send(
      'topic-order-feedback-findAllFeedbacks',
      `${JSON.stringify({ query })}`,
    ); // args - topic, message
  }

  // find feedback by feedback id route
  @UseGuards(AuthGuard)
  @Get('/feedback/find/:id')
  @Roles('SuperAdmin', 'Admin')
  @UseFilters(new HttpExceptionFilter())
  findOneFeedback(@Param() param: { id: string }) {
    return this.client.send(
      'topic-order-feedback-findOneFeedback',
      `${JSON.stringify({ param })}`,
    ); // args - topic, message
  }

  // find feedback of order using order id route
  @UseGuards(AuthGuard)
  @Get('/feedback/order/:id')
  @Roles('SuperAdmin', 'Admin', 'Customer')
  @UseFilters(new HttpExceptionFilter())
  findAllFeedbackByOrderId(
    @Req() req,
    @Param() param: { id: string },
    @Query() query: FeedbackPaginationQueryDTO,
  ) {
    const { id, role } = req.user;
    return this.client.send(
      'topic-order-feedback-findAllFeedbacksByOrderId',
      `${JSON.stringify({ id, role, param, query })}`,
    ); // args - topic, message
  }

  // find all feedbacks of one customer using customer id
  @UseGuards(AuthGuard)
  @Get('/feedback/customer')
  @Roles('Customer')
  @UseFilters(new HttpExceptionFilter())
  findAllFeedbackByCustomerId(
    @Req() req,
    @Query() query: FeedbackPaginationQueryDTO,
  ) {
    const { id } = req.user;
    return this.client.send(
      'topic-order-feedback-findAllFeedbacksByCustomerId',
      `${JSON.stringify({ id, query })}`,
    ); // args - topic, message
  }

  //  Payments routes

  // create route for payment
  @UseGuards(AuthGuard)
  @Post('/payment')
  @Roles('Customer')
  @UseFilters(new HttpExceptionFilter())
  createPayments(@Body() body: PaymentDTO) {
    return this.client.send(
      'topic-order-payment-createPayment',
      `${JSON.stringify({ body })}`,
    ); // args - topic, message
  }

  // find all payments route for payments
  @UseGuards(AuthGuard)
  @Get('/payment')
  @Roles('Customer', 'SuperAdmin', 'Admin')
  @UseFilters(new HttpExceptionFilter())
  findAllPayments(@Query() query: PaymentPaginationQueryDTO) {
    return this.client.send(
      'topic-order-payment-findAllPayments',
      `${JSON.stringify({ query })}`,
    ); // args - topic, message
  }

  // find single payment by payment id route for payment
  @UseGuards(AuthGuard)
  @Get('/payment/find/:id')
  @Roles('Customer', 'SuperAdmin', 'Admin')
  @UseFilters(new HttpExceptionFilter())
  findOnePayment(@Param() param: { id: string }) {
    return this.client.send(
      'topic-order-payment-findOnePayment',
      `${JSON.stringify({ param })}`,
    ); // args - topic, message
  }

  // find all payments by customer id route
  @UseGuards(AuthGuard)
  @Get('/payment/customer/:id')
  @Roles('Customer', 'SuperAdmin', 'Admin')
  @UseFilters(new HttpExceptionFilter())
  findOneCustomerAllPayments(@Param() param: { id: string }) {
    return this.client.send(
      'topic-order-payment-findAllPaymentsByCustomerId',
      `${JSON.stringify({ param })}`,
    ); // args - topic, message
  }

  //  Orders routes
  // create route for Order
  @UseGuards(AuthGuard)
  @Post('')
  @Roles('Customer', 'SuperAdmin', 'Admin', 'OrderManagement')
  @UseFilters(new HttpExceptionFilter())
  createOrder(@Req() req, @Body() body: OrderDTO) {
    const request: any = this.requestInfo(req, 'Authorized');

    return this.client.send(
      'topic-order-createOrder',
      `${JSON.stringify({
        body: {
          ...body,
          reqInfo: {
            osInfo: request.osInfo,
            deviceInfo: request.deviceInfo,
            clientInfo: request.clientInfo,
          },
        },
      })}`,
    ); // args - topic, message
  }

  // Re-Order route for Order
  @UseGuards(AuthGuard)
  @Post('/reOrder/:id')
  @Roles('Customer', 'OrderManagement')
  @UseFilters(new HttpExceptionFilter())
  re_Order(@Param() param: { id: string }) {
    return this.client.send(
      'topic-order-reOrder',
      `${JSON.stringify({ param })}`,
    ); // args - topic, message
  }

  // find all order route
  @UseGuards(AuthGuard)
  @Get('')
  @Roles('Customer', 'SuperAdmin', 'Admin', 'OrderManagement', 'Rider')
  @UseFilters(new HttpExceptionFilter())
  findAllOrders(@Query() query: OrderPaginationQueryDTO) {
    return this.client.send(
      'topic-order-findAllOrders',
      `${JSON.stringify({ query })}`,
    ); // args - topic, message
  }

  // find single order by order id route for customer
  @UseGuards(AuthGuard)
  @Get('/find/:id')
  @Roles('Rider', 'Customer', 'SuperAdmin', 'Admin', 'OrderManagement')
  @UseFilters(new HttpExceptionFilter())
  findOneOrder(@Param() param: { id: string }) {
    return this.client.send(
      'topic-order-findOneOrder',
      `${JSON.stringify({ param })}`,
    ); // args - topic, message
  }

  // cancel order by order id route for customer
  @UseGuards(AuthGuard)
  @Post('/cancel/:id')
  @Roles('Customer')
  @UseFilters(new HttpExceptionFilter())
  cancelOrder(
    @Req() req,
    @Param() param: { id: string },
    @Body() body: { reason: string },
  ) {
    const { id } = req.user;
    return this.client.send(
      'topic-order-cancelOrder',
      `${JSON.stringify({ param, id, body })}`,
    ); // args - topic, message
  }

  // reject order by Admin route
  @UseGuards(AuthGuard)
  @Post('/rejectByAdmin/:id')
  @Roles('SuperAdmin', 'Admin', 'OrderManagement')
  @UseFilters(new HttpExceptionFilter())
  rejectOrderByAdmin(
    @Req() req,
    @Param() param: { id: string },
    @Body() body: { adminRejectedNotes: string },
  ) {
    const { id } = req.user;
    const orderObserver = this.client.send(
      'topic-order-rejectOrderByAdmin',
      `${JSON.stringify({ param, adminId: id, body })}`,
    ); // args - topic, message
    const promise1 = new Promise<any>((resolve, reject) => {
      orderObserver.pipe(take(1)).subscribe((result: any) => {
        let customerId = result?.body?.customerId;
        resolve({
          notification: this.client.send(
            'topic-notification-notifications-createNotification',
            `${JSON.stringify({
              id: customerId,
              notification: {
                title: 'Order reject by Admin!',
                body: `Order #${param.id} is rejected by #${id}.`,
              },
              android: { priority: 'high' },
              data: {
                type: 'ORDER_REJECTED',
                orderId: param.id,
                title: 'Order reject by Admin!',
                body: `Order #${param.id} is rejected by #${id}.`,
              },
              apns: {
                payload: {
                  aps: {
                    alert: {
                      body: `Order #${param.id} is rejected by #${id}.`,
                      title: 'Order reject by Admin!',
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
  }

  // accept order by Admin route
  @UseGuards(AuthGuard)
  @Post('/acceptByAdmin/:id')
  @Roles('SuperAdmin', 'Admin', 'OrderManagement')
  @UseFilters(new HttpExceptionFilter())
  acceptOrderByAdmin(@Req() req, @Param() param: { id: string }) {
    const { id } = req.user;
    return this.client.send(
      'topic-order-acceptOrderByAdmin',
      `${JSON.stringify({ param, adminId: id })}`,
    ); // args - topic, message
  }

  // accept order by Admin route
  @UseGuards(AuthGuard)
  @Post('/orderReadyForPickup/:id')
  @Roles('SuperAdmin', 'Admin', 'OrderManagement')
  @UseFilters(new HttpExceptionFilter())
  orderReadyForPickup(@Req() req, @Param() param: { id: string }) {
    const { id } = req.user;
    const readyForPickupObserver = this.client.send(
      'topic-order-orderReadyForPickup',
      `${JSON.stringify({ param, adminId: id })}`,
    ); // args - topic, message

    const promise1 = new Promise<any>((resolve, reject) => {
      readyForPickupObserver.pipe(take(1)).subscribe((result: any) => {
        let userId = result?.body?.riderId;
        let customerId = result?.body?.customerId;
        resolve(
          {
            notification: {
              rider: this.client.send(
                'topic-notification-notifications-createNotification',
                `${JSON.stringify({
                  id: userId,
                  notification: {
                    title: 'Order prepared!',
                    body: `Your order #${param.id} is ready for pickup.`,
                  },
                  android: { priority: 'high' },
                  data: {
                    type: 'ORDER_READY_FOR_PICKUP',
                    orderId: param.id,
                    title: 'Order prepared!',
                    body: `Your order #${param.id} is ready for pickup.`,
                  },
                  apns: {
                    payload: {
                      aps: {
                        alert: {
                          title: 'Order prepared!',
                          body: `Your order #${param.id} is ready for pickup.`,
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
              customer: this.client.send(
                'topic-notification-notifications-createNotification',
                `${JSON.stringify({
                  id: customerId,
                  notification: {
                    title: 'Order prepared!',
                    body: `Your order #${param.id} is ready for pickup and will be on its way soon.`,
                  },
                  android: { priority: 'high' },
                  data: {
                    type: 'ORDER_READY_FOR_PICKUP',
                    orderId: param.id,
                    title: 'Order prepared!',
                    body: `Your order #${param.id} is ready for pickup and will be on its way soon.`,
                  },
                  apns: {
                    payload: {
                      aps: {
                        alert: {
                          title: 'Order prepared!',
                          body: `Your order #${param.id} is ready for pickup and will be on its way soon.`,
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
            },
            result,
          }, // args - topic, message
        );
      });
    });

    return promise1.then((notificationObserver) => {
      const promise2 = new Promise<void>((resolve, reject) => {
        notificationObserver.notification.rider
          .pipe(take(1))
          .subscribe((result: any) => {
            resolve();
          });
        notificationObserver.notification.customer
          .pipe(take(1))
          .subscribe((result: any) => {
            resolve();
          });
      });
      return promise2.then(() => notificationObserver.result);
    });
  }

  // assign rider to order by rider id route for Admin
  @UseGuards(AuthGuard)
  @Post('/assignRider/:id')
  @Roles('SuperAdmin', 'Admin', 'OrderManagement')
  @UseFilters(new HttpExceptionFilter())
  assignRider(
    @Param() param: { id: string },
    @Body() body: { riderId: string },
  ) {
    const assignRiderObserver = this.client.send(
      'topic-order-assgnRiderToOrder',
      `${JSON.stringify({ param, body })}`,
    ); // args - topic, message
    const promise1 = new Promise<any>((resolve, reject) => {
      assignRiderObserver.pipe(take(1)).subscribe((result: any) => {
        resolve(
          {
            notification: this.client.send(
              'topic-notification-notifications-createNotification',
              `${JSON.stringify({
                id: body.riderId,
                notification: {
                  title: 'New Order Assigned!',
                  body: `You have been assigned a new order #${param.id}`,
                },
                android: { priority: 'high' },
                data: {
                  type: 'ORDER_ASSIGNED',
                  orderId: param.id,
                  title: 'New Order Assigned!',
                  body: `You have been assigned a new order #${param.id}`,
                },
                apns: {
                  payload: {
                    aps: {
                      alert: {
                        title: 'New Order Assigned!',
                        body: `You have been assigned a new order #${param.id}`,
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

  // reject order by rider route
  @UseGuards(AuthGuard)
  @Post('/rejectByRider/:id')
  @Roles('Rider')
  @UseFilters(new HttpExceptionFilter())
  rejectOrderByRider(
    @Req() req,
    @Param() param: { id: string },
    @Body() body: rejectByRider,
  ) {
    const { id } = req.user;
    return this.client.send(
      'topic-order-rejectOrderByRider',
      `${JSON.stringify({ param, riderId: id, body })}`,
    ); // args - topic, message
  }

  // accept order by rider route for customer
  @UseGuards(AuthGuard)
  @Post('/acceptByRider/:id')
  @Roles('Rider')
  @UseFilters(new HttpExceptionFilter())
  acceptOrderByRider(@Req() req, @Param() param: { id: string }) {
    const { id } = req.user;
    const orderObserver = this.client.send(
      'topic-order-acceptOrderByRider',
      `${JSON.stringify({ param, riderId: id })}`,
    ); // args - topic, message
    const promise1 = new Promise<any>((resolve, reject) => {
      orderObserver.pipe(take(1)).subscribe((result: any) => {
        let customerId = result?.body?.adminId;
        resolve({
          notification: this.client.send(
            'topic-notification-notifications-createNotification',
            `${JSON.stringify({
              id: customerId,
              notification: {
                title: 'Order Accepted!',
                body: `Order #${param.id} is accept by #${id}`,
              },
              android: { priority: 'high' },
              data: {
                type: 'ORDER_ACCEPTED_BY_RIDER',
                orderId: param.id,
                title: 'Order Accepted!',
                body: `Order #${param.id} is accept by #${id}`,
              },
              apns: {
                payload: {
                  aps: {
                    alert: {
                      title: 'Order Accepted!',
                      body: `Order #${param.id} is accept by #${id}`,
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
  }

  // pickUp order by order id route for rider
  @UseGuards(AuthGuard)
  @Post('/pickUp/:id')
  @Roles('Rider')
  @UseFilters(new HttpExceptionFilter())
  pickUpOrder(@Req() req, @Param() param: { id: string }) {
    const { id } = req.user;
    const pickupObserver = this.client.send(
      'topic-order-pickUpOrder',
      `${JSON.stringify({ param, id })}`,
    ); // args - topic, message
    const promise1 = new Promise<any>((resolve, reject) => {
      pickupObserver.pipe(take(1)).subscribe((result: any) => {
        let userId = result?.body?.customerId;
        resolve(
          {
            notification: this.client.send(
              'topic-notification-notifications-createNotification',
              `${JSON.stringify({
                id: userId,
                notification: {
                  title: 'Order picked up by rider',
                  body: `Your order #${param.id} is on the way`,
                },
                android: { priority: 'high' },
                data: {
                  type: 'ORDER_PICKED_UP',
                  orderId: param.id,
                  title: 'Order picked up by rider',
                  body: `Your order #${param.id} is on the way`,
                },
                apns: {
                  payload: {
                    aps: {
                      alert: {
                        title: 'Order picked up by rider',
                        body: `Your order #${param.id} is on the way`,
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

  // complete order by rider route if customer recive order
  @UseGuards(AuthGuard)
  @Post('/complete/:id')
  @Roles('Rider')
  @UseFilters(new HttpExceptionFilter())
  completeOrder(@Req() req, @Param() param: { id: string }) {
    const { id } = req.user;
    const completeOrderObserver = this.client.send(
      'topic-order-completeOrder',
      `${JSON.stringify({ param, id })}`,
    ); // args - topic, message
    const promise1 = new Promise<any>((resolve, reject) => {
      completeOrderObserver.pipe(take(1)).subscribe((result: any) => {
        let customerId = result?.body?.customerId;
        resolve({
          notification: this.client.send(
            'topic-notification-notifications-createNotification',
            `${JSON.stringify({
              id: customerId,
              notification: {
                title: 'Rate your order! ⭐',
                body: `Please provide feedback on your order# ${param.id}`,
              },
              android: { priority: 'high' },
              data: {
                type: 'ORDER_DELIVERED',
                orderId: param.id,
                title: 'Rate your order! ⭐',
                body: `Please provide feedback on your order# ${param.id}`,
              },
              apns: {
                payload: {
                  aps: {
                    alert: {
                      title: 'Rate your order! ⭐',
                      body: `Please provide feedback on your order# ${param.id}`,
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
  }

  // reject order by rider route if customer not recive order
  @UseGuards(AuthGuard)
  @Post('/reject/:id')
  @Roles('Rider')
  @UseFilters(new HttpExceptionFilter())
  orderNotAccept(@Req() req, @Param() param: { id: string }) {
    const { id } = req.user;
    const rejectOrderObserver = this.client.send(
      'topic-order-rejectOrder',
      `${JSON.stringify({ param, id })}`,
    ); // args - topic, message
    const promise1 = new Promise<any>((resolve, reject) => {
      rejectOrderObserver.pipe(take(1)).subscribe((result: any) => {
        let customerId = result?.body?.customerId;
        resolve({
          notification: this.client.send(
            'topic-notification-notifications-createNotification',
            `${JSON.stringify({
              id: customerId,
              notification: {
                title: 'Your order is rejected',
                body: `Sorry for inconvenience`,
              },
              android: { priority: 'high' },
              data: {
                type: 'ORDER_FAILED',
                orderId: param.id,
                title: 'Your order is rejected',
                body: `Sorry for inconvenience`,
              },
              apns: {
                payload: {
                  aps: {
                    alert: {
                      title: 'Your order is rejected',
                      body: `Sorry for inconvenience`,
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
  }

  // update order by customer route
  @UseGuards(AuthGuard)
  @Patch('/update/:id')
  @Roles('Customer')
  @UseFilters(new HttpExceptionFilter())
  updateOrder(@Param() param: { id: string }, @Body() body: OrderDTO) {
    return this.client.send(
      'topic-order-updateOrder',
      `${JSON.stringify({ param, body })}`,
    ); // args - topic, message
  }

  // update order by customer route
  @UseGuards(AuthGuard)
  @Patch('/updateOrderByAdmin/:id')
  @Roles('Admin', 'SuperAdmin')
  @UseFilters(new HttpExceptionFilter())
  updateOrderByAdmin(
    @Param() param: { id: string },
    @Body() body: updateOrderBYAdminDTO,
  ) {
    return this.client.send(
      'topic-order-updateOrderByAdmin',
      `${JSON.stringify({ param, body })}`,
    ); // args - topic, message
  }

  // delete route for order
  @UseGuards(AuthGuard)
  @Delete('/delete/:id')
  @Roles('SuperAdmin', 'Admin', 'OrderManagement')
  @UseFilters(new HttpExceptionFilter())
  deleteOrder(@Param() param: { id: string }) {
    return this.client.send(
      'topic-order-deleteOrder',
      `${JSON.stringify({ param })}`,
    ); // args - topic, message
  }

  // get all orders of single customer by customer id route with http get method
  @UseGuards(AuthGuard)
  @Get('/customer/:id')
  @Roles('Customer', 'SuperAdmin', 'Admin', 'OrderManagement')
  @UseFilters(new HttpExceptionFilter())
  fetchAllOrdersByCustomerId(
    @Param() param: { id: string },
    @Query() query: PaginationQueryDTO,
  ) {
    return this.client.send(
      'topic-order-findAllOrdersByCustomerId',
      `${JSON.stringify({ param, query })}`,
    ); // args - topic, message
  }

  // get all orders of single branch by branch id route with http get method
  @UseGuards(AuthGuard)
  @Get('/branch/:id')
  @Roles('SuperAdmin', 'Admin', 'OrderManagement')
  @UseFilters(new HttpExceptionFilter())
  fetchAllOrdersByBranchId(
    @Param() param: { id: string },
    @Query() query: PaginationQueryDTO,
  ) {
    return this.client.send(
      'topic-order-findAllOrdersByBranchId',
      `${JSON.stringify({ param, query })}`,
    ); // args - topic, message
  }

  // get all orders activity records by single order id route with http get method
  @UseGuards(AuthGuard)
  @Get('/allOrderActivitiesByOrderId/:id')
  @Roles('SuperAdmin', 'Admin', 'OrderManagement')
  @UseFilters(new HttpExceptionFilter())
  fetchAllOrderActivitiesByOrderId(
    @Param() param: { id: string },
    @Query() query: OrderActivePaginationQueryDTO,
  ) {
    return this.client.send(
      'topic-order-findAllOrdersActivitiesByOrderId',
      `${JSON.stringify({ param, query })}`,
    ); // args - topic, message
  }

  // get all orders activity records route with http get method
  @UseGuards(AuthGuard)
  @Get('/allOrderActivities')
  @Roles('SuperAdmin', 'Admin', 'OrderManagement')
  @UseFilters(new HttpExceptionFilter())
  fetchAllOrderActivities(@Query() query: OrderActivePaginationQueryDTO) {
    return this.client.send(
      'topic-order-findAllOrdersActivities',
      `${JSON.stringify({ query })}`,
    ); // args - topic, message
  }

  // get all orders of single rider by rider id route with http get method
  @UseGuards(AuthGuard)
  @Get('/rider/:id')
  @Roles('SuperAdmin', 'Admin', 'OrderManagement')
  @UseFilters(new HttpExceptionFilter())
  fetchAllOrdersByRiderId(
    @Param() param: { id: string },
    @Query() query: OrderPaginationQueryDTO,
  ) {
    return this.client.send(
      'topic-order-findAllOrdersByRiderId',
      `${JSON.stringify({ param, query })}`,
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
