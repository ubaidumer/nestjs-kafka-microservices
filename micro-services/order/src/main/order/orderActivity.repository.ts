import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  OrderActivity,
  OrderActivityDocument,
} from 'src/entity/orderActivity.entity';

@Injectable()
export class OrderActivityRepository {
  constructor(
    @InjectModel(OrderActivity.name)
    private orderActivityModel: Model<OrderActivityDocument>,
  ) {}

  // create query and exception handling
  async create(body) {
    try {
      return await this.orderActivityModel.create(body);
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // get all order activities and exception handling
  async getAllOrderActivities(data) {
    try {
      const {
        page = 0,
        limit = 10,
        sort = 'desc',
        orderId,
        orderStatus,
      } = data;

      let query = {};
      query = {
        ...(orderId && { orderId }),
        ...(orderStatus && { orderStatus }),
      };

      const response = await Promise.all([
        this.orderActivityModel
          .find(query)
          .sort({ createdAt: sort })
          .skip(page * limit)
          .limit(limit),
        this.orderActivityModel.countDocuments(),
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

  // get all order activities and exception handling
  async getAllOrderActivitiesByOrderId(id, data) {
    try {
      const { page = 0, limit = 10, sort = 'desc' } = data;

      const response = await Promise.all([
        this.orderActivityModel
          .find({ orderId: id })
          .sort({ createdAt: sort })
          .skip(page * limit)
          .limit(limit),
        this.orderActivityModel.countDocuments({ orderId: id }),
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

  async findOneByOrderIdAndOrderStatus(orderId, orderStatus) {
    try {
      return await this.orderActivityModel.findOne({ orderId, orderStatus });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }
}
