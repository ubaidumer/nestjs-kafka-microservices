import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { PaymentRepository } from './payment.repository';

@Injectable()
export class PaymentService {
  constructor(
    @InjectConnection() private connection: Connection,
    private readonly paymentRepo: PaymentRepository,
  ) {}

  // create query and exception handling
  async create(body) {
    try {
      const data = await this.paymentRepo.create(body);
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // search by payments id query and exception handling
  async findById(id) {
    try {
      await this.validateId(id);
      const data = await this.paymentRepo.findById(id);
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // get all payments and exception handling
  async getAllPayments(query) {
    try {
      const data = await this.paymentRepo.getAllPayments(query);
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // get all payments by customer id query and exception handling
  async fetchAllPaymentsByCustomerId(id: string) {
    try {
      const data = await this.paymentRepo.fetchAllPaymentsByCustomerId(id);
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // validates payment id
  async validateId(id) {
    const checkId = await this.paymentRepo.findById(id);
    if (id !== null && !checkId) {
      throw new BadRequestException('ORDER_E0007');
    }
    return;
  }
}
