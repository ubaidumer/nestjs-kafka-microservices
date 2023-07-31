import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from 'src/entity/order.entity';
import { OrderStatus } from 'src/utils/constants/orderConstants';
import { ConfigurationRepository } from './configuration.repository';
import { OrderActivityRepository } from './orderActivity.repository';

@Injectable()
export class OrderRepository {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private readonly orderActivityRepo: OrderActivityRepository,
    private readonly configRepo: ConfigurationRepository,
  ) {}

  // create query and exception handling
  async create(body) {
    try {
      const completeFormate = ['0', '00', '000'];
      let lastRecord = await this.orderModel
        .find()
        .limit(1)
        .sort({ createdAt: 'desc' });
      if (lastRecord.length === 0) {
        body.orderNo = `OD0001`;
      } else {
        let orderNo = lastRecord[0].orderNo;
        let secondPart = parseInt(orderNo.slice(-3)) + 1;
        let numberToString = secondPart.toString();
        numberToString =
          completeFormate[completeFormate.length - numberToString.length] +
          secondPart;
        body.orderNo = `OD${numberToString}`;
      }

      const data = await this.orderModel.create(body);
      await this.orderActivityRepo.create({
        orderId: data._id,
        orderStatus: OrderStatus.PLACED,
        customerId: data.customerId,
        description: 'Order is Placed!',
      });
      if (body.orderManualAcceptance) {
        await this.orderActivityRepo.create({
          orderId: data._id,
          orderStatus: OrderStatus.ACCEPTED,
          customerId: data.customerId,
          description: 'Order is auto accepted accepted!',
        });
      } else {
      }

      return data;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // re-order new order by order id query and exception handling
  async reOrder(id) {
    try {
      const order = await this.orderModel.findById(id);
      const data = await this.getReOrderObjectvlues(order);
      const reOrder = await this.create(data);

      await this.orderActivityRepo.create({
        orderId: reOrder._id,
        orderStatus: OrderStatus.PLACED,
        customerId: order.customerId,
        description: 'Order is reOrdered and Placed!',
      });

      return reOrder;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // cancel order by order id, rider id query and exception handling
  async cancelOrder(id, userId, reason) {
    try {
      const order = await this.findById(id);
      order.status = OrderStatus.CANCELED;
      order.reason = reason;
      await order.save();
      // todo
      await this.orderActivityRepo.create({
        orderId: order._id,
        orderStatus: OrderStatus.CANCELED,
        customerId: userId,
        description: 'Order is Cancelled!',
      });
      return 'Order cancled Successfully!';
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // pick-up order order by order id, rider id query and exception handling
  async pickUpOrder(id, userId) {
    try {
      const order = await this.orderModel.findById(id);

      // update status and change it to Pickup
      order.status = OrderStatus.PICKEDUP;
      await order.save();
      // todo
      await this.orderActivityRepo.create({
        orderId: order._id,
        orderStatus: OrderStatus.PICKEDUP,
        customerId: order.customerId,
        riderId: userId,
        description: 'Order is PICKEDUP!',
      });
      return order;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // assin rider to order by order id query and exception handling
  async assignRider(ids, riderId) {
    try {
      const order = await this.orderModel.updateMany(
        { _id: { $in: ids } },
        {
          status: OrderStatus.WAITINGRIDER,
          riderId: riderId,
        },
        { new: true },
      );
      ids.map(async (id) => {
        await this.orderActivityRepo.create({
          orderId: id,
          orderStatus: OrderStatus.WAITINGRIDER,
          customerId: riderId,
          description: `Order is Assinged to ${riderId} now!`,
        });
      });

      return order;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // assin rider to order by order id query and exception handling
  async readyForPickup(id, adminId) {
    try {
      const order = await this.orderModel.findById(id);
      // update status and change it to preparing
      order.status = OrderStatus.READYFORPICKUP;
      await order.save();

      await this.orderActivityRepo.create({
        orderId: order._id,
        orderStatus: OrderStatus.READYFORPICKUP,
        customerId: order.adminId,
        description: 'Order is ready and waiting for rider now!',
      });

      return order;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // accept order by rider
  async acceptOrderByRider(id) {
    try {
      const order = await this.orderModel.findById(id);
      // update status and change it to preparing
      order.status = OrderStatus.PREPARING;
      await order.save();

      // rider accept order requset
      await this.orderActivityRepo.create({
        orderId: order._id,
        orderStatus: OrderStatus.ASSIGNED,
        customerId: order.customerId,
        description: 'Rider accept incoming order!',
      });

      // Now order in preparing in kitchens
      await this.orderActivityRepo.create({
        orderId: order._id,
        orderStatus: OrderStatus.PREPARING,
        customerId: order.customerId,
        description: 'Order is preparing now!',
      });
      return order;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // reject order by rider
  async rejectOrderByRider(id, riderRejectedReason) {
    try {
      const order = await this.orderModel.findById(id);

      // update status and change it to preparing
      order.status = OrderStatus.ACCEPTED;
      order.riderRejectedReason = riderRejectedReason;
      order.riderId = '';
      await order.save();

      await this.orderActivityRepo.create({
        orderId: order._id,
        orderStatus: OrderStatus.REJECTEDBYRIDER,
        customerId: order.customerId,
        description:
          'Order is reject by rider and switch to Accepted status again!',
      });

      return order;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // accept order by rider
  async acceptOrderByAdmin(id, adminId) {
    try {
      const order = await this.orderModel.findById(id);

      // update status and change it to preparing
      order.status = OrderStatus.ACCEPTED;
      order.adminId = adminId;
      await order.save();

      await this.orderActivityRepo.create({
        orderId: order._id,
        orderStatus: OrderStatus.ACCEPTED,
        customerId: order.customerId,
        description: 'Order is Accepted by admin now!',
      });
      return order;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // reject order by rider
  async rejectOrderByAdmin(id, adminId, adminRejectedNotes) {
    try {
      const order = await this.orderModel.findById(id);

      // update status and change it to preparing
      order.status = OrderStatus.REJECTED;
      order.adminId = adminId;
      if (adminRejectedNotes) {
        order.adminRejectedNotes = adminRejectedNotes;
      }
      await order.save();

      await this.orderActivityRepo.create({
        orderId: order._id,
        orderStatus: OrderStatus.PREPARING,
        customerId: order.customerId,
        description:
          'Order is reject by admin and switch to placed status again!',
      });

      return order;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // complete order order by order id , rider id query and exception handling
  async recivedOrderByCustomer(id) {
    try {
      const order = await this.orderModel.findById(id);

      // update status and change it to complete
      order.status = OrderStatus.DELIVERED;
      await order.save();

      await this.orderActivityRepo.create({
        orderId: order._id,
        orderStatus: OrderStatus.DELIVERED,
        customerId: order.customerId,
        description: 'Order is DELIVERED!',
      });

      return order;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // reject order order by order id , rider id query and exception handling
  async rejectOrderByCustomer(id, userId) {
    try {
      const order = await this.orderModel.findById(id);

      // update status and change it to reject
      order.status = OrderStatus.FAILED;
      await order.save();

      await this.orderActivityRepo.create({
        orderId: order._id,
        orderStatus: OrderStatus.FAILED,
        customerId: order.customerId,
        description: 'Order is REJECTED!',
      });

      return order;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // search by order id query and exception handling
  async findById(id) {
    try {
      return await this.orderModel.findById(id);
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // get all orders and exception handling
  async getAllOrders(data) {
    try {
      const {
        page = 0,
        limit = 10,
        sort = 'desc',
        startDate,
        endDate,
        customerId,
        id,
        customerPhoneNo,
        branchId,
        status,
        riderId,
      } = data;
      const statuses = status?.split(',');

      let query = {};
      query = {
        ...query,
        ...(status && { status: { $in: statuses } }),
        ...(startDate && { createdAt: { $gt: startDate } }),
        ...(endDate && { createdAt: { $lt: endDate } }),
        ...(customerId && { customerId: customerId }),
        ...(customerPhoneNo && { customerPhoneNo: customerPhoneNo }),
        ...(branchId && { branchId: branchId }),
        ...(riderId && { riderId: riderId }),
        ...(id && { _id: id }),
      };

      const response = await Promise.all([
        this.orderModel
          .find(query)
          .sort({ createdAt: sort })
          .skip(page * limit)
          .limit(limit),
        this.orderModel.countDocuments(query),
      ]);

      return {
        data: response[0],
        limit,
        page,
        count: response[1],
      };
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // get all orders activity rocords and exception handling
  async fetchAllOrderActivities(data) {
    try {
      return await this.orderActivityRepo.getAllOrderActivities(data);
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // get all orders activity rocords by order Id and exception handling
  async getAllOrderActivitiesByOrderId(id, data) {
    try {
      return await this.orderActivityRepo.getAllOrderActivitiesByOrderId(
        id,
        data,
      );
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // get all orders by customer id query and exception handling
  async fetchAllOrdersByCustomerId(id: string, data) {
    try {
      const { page = 0, limit = 10, sort = 'desc' } = data;

      const response = await Promise.all([
        this.orderModel
          .find({ customerId: id })
          .sort({ createdAt: sort })
          .skip(page * limit)
          .limit(limit),
        this.orderModel.countDocuments({ customerId: id }),
      ]);

      return {
        data: response[0],
        limit,
        page,
        count: response[1],
      };
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // get all orders by branch id query and exception handling
  async fetchAllOrdersByBranchId(id: string, data) {
    try {
      const { page = 0, limit = 10, sort = 'desc' } = data;

      const response = await Promise.all([
        this.orderModel
          .find({ branchId: id })
          .sort({ createdAt: sort })
          .skip(page * limit)
          .limit(limit),
        this.orderModel.countDocuments({ branchId: id }),
      ]);

      return {
        data: response[0],
        limit,
        page,
        count: response[1],
      };
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // get all orders by rider id query and exception handling
  async fetchAllOrdersByRiderId(id: string, data) {
    try {
      const { page = 0, limit = 10, sort = 'desc', status } = data;

      let query = {};
      if (status === 'active') {
        query = {
          status: {
            $in: ['WAITINGRIDER', 'PREPARING', 'READYFORPICKUP', 'PICKEDUP'],
          },
        };
      }

      const response = await Promise.all([
        this.orderModel
          .find({ riderId: id, ...query })
          .sort({ createdAt: sort })
          .skip(page * limit)
          .limit(limit),
        this.orderModel.countDocuments({ riderId: id }),
      ]);

      return {
        data: response[0],
        limit,
        page,
        count: response[1],
      };
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // update by order id query and exception handling
  async updateOrderById(id: string, body) {
    try {
      return await this.orderModel.findByIdAndUpdate(id, body, { new: true });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // delete by order id query and exception handling
  async deleteOrderById(id: string) {
    try {
      return await this.orderModel.findByIdAndDelete(id);
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // validates orders id
  async getReOrderObjectvlues(body) {
    return {
      subTotal: body.subTotal,
      total: body.total,
      deliveryCharges: body.deliveryCharges,
      tax: body.tax,
      status: body.status,
      type: body.type,
      isPaid: body.isPaid,
      paymentStatus: body.paymentStatus,
      description: body.description,
      customerType: body.customerType,
      deviceType: body.deviceType,
      orderItems: body.orderItems,
      branchId: body.branchId,
      adminId: body.adminId,
      riderId: body.riderId,
      paymentId: body.paymentId,
      feedbackId: body.feedbackId,
      customerId: body.customerId,
    };
  }
}
