import { BadRequestException, Injectable } from '@nestjs/common';
import {
  LateStatus,
  OrderStatus,
  lateStatusCategory,
} from 'src/utils/constants/orderConstants';
import { ConfigurationRepository } from './configuration.repository';
import { OrderRepository } from './order.repository';
import { Cron } from '@nestjs/schedule';
import * as moment from 'moment';
import { OrderActivityRepository } from './orderActivity.repository';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepo: OrderRepository,
    private readonly configurationRepo: ConfigurationRepository,
    private readonly orderActivityRepo: OrderActivityRepository,
  ) {}

  // create query and exception handling
  async create(body: any) {
    try {
      const Configuration = await this.configurationRepo.findOne();
      if (Configuration.orderManualAcceptance) {
        body.status = OrderStatus.ACCEPTED;
      } else {
        body.status = OrderStatus.PLACED;
      }
      const orderAlReadyInProgress = await this.orderRepo.getAllOrders({
        customerId: body.customerId,
        status:
          'PLACED,ACCEPTED,WAITINGRIDER,PREPARING,READYFORPICKUP,PICKEDUP',
      });
      if (orderAlReadyInProgress.data.length > 0) {
        throw new BadRequestException('ORDER_E0009');
      }

      body.tax = 200;
      body.deliveryCharges = 200;

      // Summing up the "prep time" property
      body.deliveryPrepTime = body.orderItems.reduce(
        (accumulator, currentValue) =>
          currentValue.productPrepTime *
            (currentValue.productQuantity ? currentValue.productQuantity : 1) +
          accumulator,
        0,
      );
      body.subTotal = 0;

      // Summing up the "subTotal" property
      for (let i = 0; i < body.orderItems.length; i++) {
        if (!body.orderItems[i].productOptions) {
          body.subTotal =
            body.subTotal +
            body.orderItems[i].productBasePrice *
              body.orderItems[i].productQuantity;
        } else {
          for (let j = 0; j < body.orderItems[i].productOptions.length; j++) {
            let orderItemsTotal =
              (body.orderItems[i].productQuantity
                ? body.orderItems[i].productQuantity
                : 1) *
              body.orderItems[i].productOptions[j].variations.reduce(
                (accumulator, currentValue) =>
                  currentValue.price *
                    (currentValue.quantity ? currentValue.quantity : 1) +
                  accumulator,
                0,
              );
            body.subTotal = orderItemsTotal + body.subTotal;
          }
        }
      }

      // Summing up the "total" property
      body.total = body.subTotal + body.tax + body.deliveryCharges;
      const data = await this.orderRepo.create(body);

      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // search by customer id query and exception handling
  async reOrder(id) {
    try {
      await this.validateId(id);
      const data = await this.orderRepo.reOrder(id);
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // cancel order by order id, customer id query and exception handling
  async cancelOrder(id, userId, reason) {
    try {
      const order = await this.validateId(id);

      if (order.customerId !== userId) {
        throw new BadRequestException('ORDER_E0001');
      }
      if (order.status === OrderStatus.CANCELED) {
        throw new BadRequestException('ORDER_E0002');
      }

      const configuration = await this.configurationRepo.findOne();
      const orderHistory =
        await this.orderActivityRepo.findOneByOrderIdAndOrderStatus(
          id,
          OrderStatus.PLACED,
        );
      const currentTime = moment(new Date().toISOString());

      if (orderHistory) {
        const checkTime = moment(orderHistory.createdAt)
          .add(configuration.OrderCancelTimeLimit, 'minute')
          .isSameOrBefore(currentTime);

        if (checkTime) {
          throw new BadRequestException('ORDER_E0011');
        }
      }

      const duration = new Date().getTime() - order.createdAt.getTime();

      // update status and change it to cancle
      const durationInSeconds = duration / 1000;

      if (durationInSeconds > 300) {
        throw new BadRequestException('ORDER_E0003');
      }
      const data = await this.orderRepo.cancelOrder(id, userId, reason);
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // pickup order by order id, rider id query and exception handling
  async pickUpOrder(id, userId) {
    try {
      const order = await this.validateId(id);

      if (order.status === OrderStatus.CANCELED) {
        throw new BadRequestException('ORDER_E0002');
      }

      if (order.riderId !== userId) {
        throw new BadRequestException('ORDER_E0004');
      }

      if (order.status !== OrderStatus.READYFORPICKUP) {
        throw new BadRequestException('ORDER_E0005');
      }
      const data = await this.orderRepo.pickUpOrder(id, userId);
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // assign rider to order by order id query and exception handling
  async assignRider(id, riderId) {
    try {
      const orderIds = id?.split(',');
      // return orderIds;
      for (let i = 0; i < orderIds.length; i++) {
        const order = await this.validateId(orderIds[i]);
        if (order.status === OrderStatus.CANCELED) {
          throw new BadRequestException('ORDER_E0002');
        }
        if (
          order.status !== OrderStatus.ACCEPTED &&
          order.status !== OrderStatus.REJECTEDBYRIDER
        ) {
          throw new BadRequestException('ORDER_E0005');
        }
      }
      const data = await this.orderRepo.assignRider(orderIds, riderId);
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // assign rider to order by order id query and exception handling
  async readyForPickup(id, adminId) {
    try {
      const order = await this.validateId(id);

      if (order.status === OrderStatus.CANCELED) {
        throw new BadRequestException('ORDER_E0002');
      }
      if (order.status !== OrderStatus.PREPARING) {
        throw new BadRequestException('ORDER_E0002');
      }

      const data = await this.orderRepo.readyForPickup(id, adminId);
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // assign rider to order by order id query and exception handling
  async acceptOrderByRider(id, riderId) {
    try {
      const order = await this.validateId(id);

      if (order.status === OrderStatus.CANCELED) {
        throw new BadRequestException('ORDER_E0002');
      }

      if (riderId !== order.riderId) {
        throw new BadRequestException('ORDER_E0004');
      }

      if (order.status !== OrderStatus.WAITINGRIDER) {
        throw new BadRequestException('ORDER_E0005');
      }

      const data = await this.orderRepo.acceptOrderByRider(id);
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // assign rider to order by order id query and exception handling
  async rejectOrderByRider(id, riderId, riderRejectedReason) {
    try {
      const order = await this.validateId(id);
      if (order.status === OrderStatus.CANCELED) {
        throw new BadRequestException('ORDER_E0002');
      }

      if (riderId !== order.riderId) {
        throw new BadRequestException('ORDER_E0004');
      }

      if (order.status !== OrderStatus.WAITINGRIDER) {
        throw new BadRequestException('ORDER_E0005');
      }

      const data = await this.orderRepo.rejectOrderByRider(
        id,
        riderRejectedReason,
      );
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // assign rider to order by order id query and exception handling
  async acceptOrderByAdmin(id, adminId) {
    try {
      const order = await this.validateId(id);

      if (order.status === OrderStatus.CANCELED) {
        throw new BadRequestException('ORDER_E0002');
      }
      if (order.status !== OrderStatus.PLACED) {
        throw new BadRequestException('ORDER_E0005');
      }
      const data = await this.orderRepo.acceptOrderByAdmin(id, adminId);
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // assign rider to order by order id query and exception handling
  async rejectOrderByAdmin(id, adminId, adminRejectedNotes) {
    try {
      await this.validateId(id);
      const data = await this.orderRepo.rejectOrderByAdmin(
        id,
        adminId,
        adminRejectedNotes,
      );
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // complete order by order id query and exception handling
  async recivedOrderByCustomer(id, userId) {
    try {
      const order = await this.validateId(id);
      if (order.status === OrderStatus.CANCELED) {
        throw new BadRequestException('ORDER_E0002');
      }
      if (order.riderId !== userId) {
        throw new BadRequestException('ORDER_E0004');
      }

      if (order.status !== OrderStatus.PICKEDUP) {
        throw new BadRequestException('ORDER_E0005');
      }
      const data = await this.orderRepo.recivedOrderByCustomer(id);
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // reject order by order id, rider id query and exception handling
  async rejectOrderByCustomer(id, userId) {
    try {
      const order = await this.validateId(id);

      if (order.status === OrderStatus.CANCELED) {
        throw new BadRequestException('ORDER_E0002');
      }

      if (order.riderId !== userId) {
        throw new BadRequestException('ORDER_E0004');
      }

      if (order.status !== OrderStatus.PICKEDUP) {
        throw new BadRequestException('ORDER_E0005');
      }

      const data = await this.orderRepo.rejectOrderByCustomer(id, userId);
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // search by customer id query and exception handling
  async findById(id) {
    try {
      const order = await this.validateId(id);
      return { body: order, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // get all orders and exception handling
  async getAllOrders(query) {
    try {
      const data = await this.orderRepo.getAllOrders(query);
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // get all order activity records and exception handling
  async fetchAllOrderActivities(query) {
    try {
      const data = await this.orderRepo.fetchAllOrderActivities(query);
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }
  // get all order activity records by order id and exception handling
  async getAllOrderActivitiesByOrderId(id, query) {
    try {
      const data = await this.orderRepo.getAllOrderActivitiesByOrderId(
        id,
        query,
      );
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // get all orders by customer id query and exception handling
  async fetchAllOrdersByCustomerId(id: string, query) {
    try {
      const data = await this.orderRepo.fetchAllOrdersByCustomerId(id, query);
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // get all orders by branch id query and exception handling
  async fetchAllOrdersByBranchId(id: string, query) {
    try {
      const data = await this.orderRepo.fetchAllOrdersByBranchId(id, query);
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // get all orders by rider id query and exception handling
  async fetchAllOrdersByRiderId(id: string, query) {
    try {
      const data = await this.orderRepo.fetchAllOrdersByRiderId(id, query);
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // update by order id query and exception handling
  async updateOrderById(id: string, body) {
    try {
      await this.validateId(id);
      const data = await this.orderRepo.updateOrderById(id, { ...body });
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // update by order id query and exception handling
  async createConfiguration(body) {
    try {
      const data = await this.configurationRepo.create(body);
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // update by order id query and exception handling
  async findConfiguration() {
    try {
      const data = await this.configurationRepo.findOne();
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // update by order id query and exception handling
  async updateConfiguration(id, body) {
    try {
      const data = await this.configurationRepo.update(id, body);
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // delete by order id query and exception handling
  async deleteOrderById(id: string) {
    try {
      await this.validateId(id);
      const data = await this.orderRepo.deleteOrderById(id);
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // validates orders id
  async validateId(id) {
    const checkId = await this.orderRepo.findById(id);
    if (id !== null && !checkId) {
      throw new BadRequestException('ORDER_E0007');
    }
    return checkId;
  }

  // cron jobs

  @Cron('*/60 * * * * *')
  async updateOrderStatusWhenNotAcceptedByRider() {
    const result = await this.orderRepo.getAllOrders({
      status: OrderStatus.WAITINGRIDER,
    });

    const currentTime = moment(new Date().toISOString()).subtract(60, 's');
    for (let i = 0; i < result.data.length; i++) {
      const checkTime = moment(result.data[i].updatedAt).isSameOrBefore(
        currentTime,
      );
      if (checkTime) {
        this.updateOrderById(result.data[i]._id, {
          status: OrderStatus.ACCEPTED,
          riderId: null,
        });
      }
    }
  }

  @Cron('*/60 * * * * *')
  async updateOrderStatusWhenRiderNotPicksUpOrder() {
    const result = await this.orderRepo.getAllOrders({
      status: OrderStatus.READYFORPICKUP,
    });

    const currentTime = moment(new Date().toISOString()).subtract(60, 's');
    for (let i = 0; i < result.data.length; i++) {
      const checkTime = moment(result.data[i].updatedAt).isSameOrBefore(
        currentTime,
      );
      if (checkTime) {
        this.updateOrderById(result.data[i]._id, {
          status: OrderStatus.ACCEPTED,
          riderId: null,
        });
      }
    }
  }

  // cron job for late order status
  @Cron('*/60 * * * * *')
  async lateAdminAcceptOrder() {
    const orders = await this.orderRepo.getAllOrders({
      status: OrderStatus.PLACED,
    });

    const configuration = await this.configurationRepo.findOne();
    const currentTime = moment(new Date().toISOString()).subtract(60, 's');

    for (let i = 0; i < orders.data.length; i++) {
      const orderHistory =
        await this.orderActivityRepo.findOneByOrderIdAndOrderStatus(
          orders.data[i]._id,
          OrderStatus.PLACED,
        );
      if (orderHistory) {
        const checkTime = moment(orderHistory.createdAt)
          .add(configuration.adminAcceptanceTimeLimit, 'minute')
          .isSameOrBefore(currentTime);

        if (checkTime) {
          this.updateOrderById(orders.data[i]._id, {
            $addToSet: { lateStatus: LateStatus.ADMINACCEPTEDLATE },
          });
        }
      }
    }
  }

  // cron job for late order status
  @Cron('*/60 * * * * *')
  async lateRiderAssignOrder() {
    const orders = await this.orderRepo.getAllOrders({
      status: OrderStatus.ACCEPTED,
    });

    const configuration = await this.configurationRepo.findOne();
    const currentTime = moment(new Date().toISOString()).subtract(60, 's');

    for (let i = 0; i < orders.data.length; i++) {
      const orderHistory =
        await this.orderActivityRepo.findOneByOrderIdAndOrderStatus(
          orders.data[i]._id,
          OrderStatus.ACCEPTED,
        );
      if (orderHistory) {
        const checkTime = moment(orderHistory.createdAt)
          .add(configuration.riderAssigningTimeLimit, 'minute')
          .isSameOrBefore(currentTime);

        console.log(checkTime);
        if (checkTime) {
          this.updateOrderById(orders.data[i]._id, {
            $addToSet: { lateStatus: LateStatus.RIDERASSIGNEDLATE },
          });
        }
      }
    }
  }

  // cron job for late order status
  @Cron('*/60 * * * * *')
  async lateRiderAcceptOrder() {
    const orders = await this.orderRepo.getAllOrders({
      status: `${OrderStatus.ACCEPTED},${OrderStatus.WAITINGRIDER}`,
    });

    const configuration = await this.configurationRepo.findOne();
    const currentTime = moment(new Date().toISOString()).subtract(60, 's');

    for (let i = 0; i < orders.data.length; i++) {
      const orderHistory =
        await this.orderActivityRepo.findOneByOrderIdAndOrderStatus(
          orders.data[i]._id,
          OrderStatus.WAITINGRIDER,
        );
      if (orderHistory) {
        const checkTime = moment(orderHistory.createdAt)
          .add(configuration.riderAcceptanceTimeLimit, 'minute')
          .isSameOrBefore(currentTime);

        if (checkTime) {
          this.updateOrderById(orders.data[i]._id, {
            $addToSet: { lateStatus: LateStatus.RIDERACCEPTEDLATE },
          });
        }
      }
    }
  }

  // cron job for late order status
  @Cron('*/60 * * * * *')
  async lateRiderPickupOrder() {
    const orders = await this.orderRepo.getAllOrders({
      status: OrderStatus.PREPARING,
    });

    const configuration = await this.configurationRepo.findOne();
    const currentTime = moment(new Date().toISOString()).subtract(60, 's');

    for (let i = 0; i < orders.data.length; i++) {
      const orderHistory =
        await this.orderActivityRepo.findOneByOrderIdAndOrderStatus(
          orders.data[i]._id,
          OrderStatus.PREPARING,
        );
      if (orderHistory) {
        const checkTime = moment(orderHistory.createdAt)
          .add(configuration.riderPickupTimeLimit, 'minute')
          .isSameOrBefore(currentTime);

        if (checkTime) {
          this.updateOrderById(orders.data[i]._id, {
            $addToSet: { lateStatus: LateStatus.RIDERPICKEDUPLATE },
          });
        }
      }
    }
  }
}
