import { BadRequestException, Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { formatResponse } from 'src/utils/response';
import { OrderService } from './order.service';
import { kafkaClientManager } from 'src/utils/kafka.saga.client';
import { take } from 'rxjs';

// Routes for payment Api's
@Controller()
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly sagaKafkaClient: kafkaClientManager,
  ) {}

  // create route for order
  @MessagePattern('topic-order-createOrder')
  async createOrder(@Payload() data) {
    try {
      const customerObserver = await this.sagaKafkaClient.sagaClient.send(
        'saga-topic-order-to-customer-findCustomerStatus',
        `${JSON.stringify({ data: data.body.customerId })}`,
      ); // args - topic, message

      const promise1 = new Promise<void>((resolve, reject) => {
        customerObserver.pipe(take(1)).subscribe((result: any) => {
          resolve(result);
        });
      });
      let customerData: any = {};
      customerData = await promise1.then((result) => {
        return result;
      });

      if (Object.keys(customerData).length === 0)
        throw new BadRequestException('CUSTOMER_E0005');
      if (customerData.status === 'BLOCKED') {
        throw new BadRequestException('ORDER_E0010');
      }
      const result = await this.orderService.create(data.body);
      if (data.body.alternatePhoneNo.length !== 0 && result.isSuccess) {
        const updateCustomerObserver =
          await this.sagaKafkaClient.sagaClient.send(
            'saga-topic-order-to-customer-updateCustomeralternatePhoneNumber',
            `${JSON.stringify({
              id: result.body.customerId,
              alternatePhoneNo: result.body.alternatePhoneNo,
            })}`,
          ); // args - topic, message

        new Promise<void>((resolve, reject) => {
          updateCustomerObserver.pipe(take(1)).subscribe((result: any) => {
            resolve();
          });
        });
      }
      if (result.isSuccess) {
        const updateProductObserver =
          await this.sagaKafkaClient.sagaClient.send(
            'saga-topic-order-to-product-updateProduct',
            `${JSON.stringify({
              orderItems: result.body.orderItems,
            })}`,
          ); // args - topic, message

        new Promise<void>((resolve, reject) => {
          updateProductObserver.pipe(take(1)).subscribe((result: any) => {
            resolve();
          });
        });
      }

      if (result.isSuccess) {
        return formatResponse(
          result.isSuccess,
          result.code,
          'ORDER_S1001',
          result.body,
        );
      } else {
        return formatResponse(result.isSuccess, result.code, result.message);
      }
    } catch (error) {
      return {
        code: error.status,
        message: error.message,
        isSuccess: false,
      };
    }
  }

  // Re-Order route for order
  @MessagePattern('topic-order-reOrder')
  async reOrder(@Payload() data) {
    const result = await this.orderService.reOrder(data.param.id);
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'ORDER_S1002',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // find all orders route
  @MessagePattern('topic-order-findAllOrders')
  async findAllOrders(@Payload() data) {
    const result = await this.orderService.getAllOrders(data.query);
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'ORDER_S1003',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // find one using order id route
  @MessagePattern('topic-order-findOneOrder')
  async findOneOrder(@Payload() data) {
    const result = await this.orderService.findById(data.param.id);

    // const customerObserver = await this.sagaKafkaClient.sagaClient.send(
    //   'saga-topic-order-to-customer-findCustomer',
    //   `${JSON.stringify({ data: result.body })}`,
    // ); // args - topic, message

    // const promise1 = new Promise<void>((resolve, reject) => {
    //   customerObserver.pipe(take(1)).subscribe((result: any) => {
    //     resolve(result);
    //   });
    // });

    // result.body = await promise1.then((result) => {
    //   return result;
    // });
    // const result = await this.orderService.(data.param.id);
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'ORDER_S1004',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // update one order using order id route
  @MessagePattern('topic-order-updateOrder')
  async updateOrder(@Payload() data) {
    const result = await this.orderService.updateOrderById(
      data.param.id,
      data.body,
    );
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'CUSTOMER_S1005',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // update one order using order id by admin route
  @MessagePattern('topic-order-updateOrderByAdmin')
  async updateOrderByAdmin(@Payload() data) {
    const result = await this.orderService.updateOrderById(
      data.param.id,
      data.body,
    );
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'CUSTOMER_S1005',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }
  // delete one order using order id route
  @MessagePattern('topic-order-deleteOrder')
  async deleteOrder(@Payload() data) {
    const result = await this.orderService.deleteOrderById(data.param.id);
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'ORDER_S1006',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // find all orders by customer Id route
  @MessagePattern('topic-order-findAllOrdersByCustomerId')
  async findAllOrdersByCustomerId(@Payload() data) {
    const result = await this.orderService.fetchAllOrdersByCustomerId(
      data.param.id,
      data.query,
    );
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'ORDER_S1007',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // find one rider all orders using rider id route
  @MessagePattern('topic-order-findAllOrdersByRiderId')
  async fetchAllOrdersByRiderId(@Payload() data) {
    const result = await this.orderService.fetchAllOrdersByRiderId(
      data.param.id,
      data.query,
    );
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'CUSTOMER_S1008',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // find one branch all orders using branch id route
  @MessagePattern('topic-order-findAllOrdersByBranchId')
  async fetchAllOrdersByBranchId(@Payload() data) {
    const result = await this.orderService.fetchAllOrdersByBranchId(
      data.param.id,
      data.query,
    );
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'CUSTOMER_S1009',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // cancel order using order id route
  @MessagePattern('topic-order-cancelOrder')
  async cancleOrder(@Payload() data) {
    const result = await this.orderService.cancelOrder(
      data.param.id,
      data.id,
      data.reason,
    );
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'ORDER_S1010',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // pickUp order using order id route
  @MessagePattern('topic-order-pickUpOrder')
  async pickUporder(@Payload() data) {
    const result = await this.orderService.pickUpOrder(data.param.id, data.id);
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'ORDER_S1011',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // customer recived order using order id route
  @MessagePattern('topic-order-completeOrder')
  async recivedOrderByCustomer(@Payload() data) {
    const result = await this.orderService.recivedOrderByCustomer(
      data.param.id,
      data.id,
    );

    const riderId = result.body.riderId;
    const orderData = await this.orderService.getAllOrders({
      status: 'PICKEDUP',
      riderId,
    });

    if (orderData.body.count === 0) {
      const updateRiderObserver = await this.sagaKafkaClient.sagaClient.send(
        'saga-topic-order-to-rider-updateRider',
        `${JSON.stringify({ id: riderId, data: { isOnDelivery: false } })}`,
      ); // args - topic, message

      new Promise<void>((resolve, reject) => {
        updateRiderObserver.pipe(take(1)).subscribe((result: any) => {
          resolve();
        });
      });
    }

    const updateCustomerObserver = await this.sagaKafkaClient.sagaClient.send(
      'saga-topic-order-to-customer-updateCustomer',
      `${JSON.stringify({ data: result.body })}`,
    ); // args - topic, message

    new Promise<void>((resolve, reject) => {
      updateCustomerObserver.pipe(take(1)).subscribe((result: any) => {
        resolve();
      });
    });

    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'ORDER_S1012',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // customer not accept order using order id route
  @MessagePattern('topic-order-rejectOrder')
  async rejectOrderByCustomer(@Payload() data) {
    const result = await this.orderService.rejectOrderByCustomer(
      data.param.id,
      data.id,
    );

    const riderId = result.body.riderId;
    const orderData = await this.orderService.getAllOrders({
      status: 'PICKEDUP',
      riderId,
    });

    if (orderData.body.count === 0) {
      const updateRiderObserver = await this.sagaKafkaClient.sagaClient.send(
        'saga-topic-order-to-rider-updateRider',
        `${JSON.stringify({ id: riderId, data: { isOnDelivery: false } })}`,
      ); // args - topic, message

      new Promise<void>((resolve, reject) => {
        updateRiderObserver.pipe(take(1)).subscribe((result: any) => {
          resolve();
        });
      });
    }
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'ORDER_S1013',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // get all order activity records route
  @MessagePattern('topic-order-findAllOrdersActivities')
  async fetchAllOrderActivities(@Payload() data) {
    const result = await this.orderService.fetchAllOrderActivities(data.query);
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'ORDER_S1014',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // get All order activity records by order id route
  @MessagePattern('topic-order-findAllOrdersActivitiesByOrderId')
  async fetchAllOrderActivitiesByOrderId(@Payload() data) {
    const result = await this.orderService.getAllOrderActivitiesByOrderId(
      data.param.id,
      data.query,
    );
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'ORDER_S1015',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }
  // assign rider to order using order id route
  @MessagePattern('topic-order-assgnRiderToOrder')
  async assignRider(@Payload() data) {
    const result = await this.orderService.assignRider(
      data.param.id,
      data.body.riderId,
    );
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'ORDER_S1016',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // accept order by rider
  @MessagePattern('topic-order-acceptOrderByRider')
  async acceptOrderByRider(@Payload() data) {
    const result = await this.orderService.acceptOrderByRider(
      data.param.id,
      data.riderId,
    );
    const riderId = data.riderId;
    const updateRiderObserver = await this.sagaKafkaClient.sagaClient.send(
      'saga-topic-order-to-rider-updateRider',
      `${JSON.stringify({ id: riderId, data: { isOnDelivery: true } })}`,
    ); // args - topic, message

    new Promise<void>((resolve, reject) => {
      updateRiderObserver.pipe(take(1)).subscribe((result: any) => {
        resolve();
      });
    });

    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'ORDER_S1017',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // reject order by rider
  @MessagePattern('topic-order-rejectOrderByRider')
  async rejectOrderByRider(@Payload() data) {
    const result = await this.orderService.rejectOrderByRider(
      data.param.id,
      data.riderId,
      data.body.riderRejectedReason,
    );

    const riderId = data.riderId;
    const updateRiderObserver = await this.sagaKafkaClient.sagaClient.send(
      'saga-topic-order-to-rider-updateRider',
      `${JSON.stringify({ id: riderId, data: { isOnDelivery: false } })}`,
    ); // args - topic, message

    new Promise<void>((resolve, reject) => {
      updateRiderObserver.pipe(take(1)).subscribe((result: any) => {
        resolve();
      });
    });

    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'ORDER_S1018',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // accept order by rider
  @MessagePattern('topic-order-acceptOrderByAdmin')
  async acceptOrderByAdmin(@Payload() data) {
    const result = await this.orderService.acceptOrderByAdmin(
      data.param.id,
      data.adminId,
    );
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'ORDER_S1019',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // reject order by rider
  @MessagePattern('topic-order-rejectOrderByAdmin')
  async rejectOrderByAdmin(@Payload() data) {
    const result = await this.orderService.rejectOrderByAdmin(
      data.param.id,
      data.adminId,
      data.body.adminRejectedNotes,
    );
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'ORDER_S1020',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // assign rider to order using order id route
  @MessagePattern('topic-order-orderReadyForPickup')
  async readyForPickup(@Payload() data) {
    const result = await this.orderService.readyForPickup(
      data.param.id,
      data.adminId,
    );
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'ORDER_S1021',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // create manual acceptance
  @MessagePattern('topic-order-configuration-createConfiguration')
  async createConfiguration(@Payload() data) {
    const result = await this.orderService.createConfiguration(data.body);
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'ORDER_S1022',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // create manual acceptance
  @MessagePattern('topic-order-configuration-findConfiguration')
  async findConfiguration() {
    const result = await this.orderService.findConfiguration();
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'ORDER_S1022',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // create manual acceptance
  @MessagePattern('topic-order-configuration-updateConfiguration')
  async updateConfiguration(@Payload() data) {
    const result = await this.orderService.updateConfiguration(
      data.param.id,
      data.body,
    );
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'ORDER_S1022',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }
}
