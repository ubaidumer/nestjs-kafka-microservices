import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment, PaymentDocument } from 'src/entity/payment.entity';

@Injectable()
export class PaymentRepository {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
  ) {}

  // create query and exception handling
  async create(body) {
    try {
      return await this.paymentModel.create(body);
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // search by payment id query and exception handling
  async findById(id) {
    try {
      return await this.paymentModel.findById(id);
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // get all payments and exception handling
  async getAllPayments(data) {
    try {
      const { page = 0, limit = 10, sort = 'desc' } = data;

      const response = await Promise.all([
        this.paymentModel
          .find()
          .sort({ createdAt: sort })
          .skip(page * limit)
          .limit(limit),
        this.paymentModel.countDocuments(),
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

  // get all payments by customer id query and exception handling
  async fetchAllPaymentsByCustomerId(id: string) {
    try {
      return await this.paymentModel.find({ customerId: id });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }
}
