import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Voucher, VoucherDocument } from 'src/entity/voucher.entity';

// Services to perform all bussiness and required operations
@Injectable()
export class VoucherRepository {
  constructor(
    @InjectModel(Voucher.name) private voucherModel: Model<VoucherDocument>,
  ) {}

  // create query and exception handling
  async create(id, body) {
    try {
      const { endDate, startDate } = body;
      const start = new Date(startDate).getTime();
      const end = new Date(endDate).getTime();
      if (
        end < new Date().getTime() ||
        start < new Date().getTime() ||
        end < start
      ) {
        throw new BadRequestException('PRODUCT_E0010');
      }
      return await this.voucherModel.create({
        ...body,
        adminId: id,
      });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // search by voucher id query and exception handling
  async findById(id) {
    try {
      return await this.voucherModel.findById(id);
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // search by voucher id query and exception handling
  async findVoucherByCustomerId(id, query) {
    try {
      const { page = 0, limit = 10, sort = 'desc' } = query;

      const response = await Promise.all([
        this.voucherModel
          .find({ customerIds: { $elemMatch: { $eq: id } } })
          .sort({ createdAt: sort })
          .skip(page * limit)
          .limit(limit),
        this.voucherModel.countDocuments({
          customerIds: { $elemMatch: { $eq: id } },
        }),
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

  // get all vouchers and exception handling
  async getAllVouchers(data) {
    try {
      const { page = 0, limit = 10, sort = 'desc', name, startDate } = data;

      const branchId = data.branchId?.split(',');
      let query = {};

      query = {
        ...query,
        ...(name && { name: { $regex: '.*' + name + '.*', $options: 'i' } }),
        ...(branchId && {
          branchId: { $in: branchId },
        }),
        ...(startDate && { startDate: startDate }),
      };

      const response = await Promise.all([
        this.voucherModel
          .find(query)
          .sort({ createdAt: sort })
          .skip(page * limit)
          .limit(limit),
        this.voucherModel.countDocuments(query),
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

  // update by voucher id query and exception handling
  async updateVoucherById(id: string, body) {
    try {
      return await this.voucherModel.findByIdAndUpdate(id, body, { new: true });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // customer apply for a voucher
  async applyForVoucher(id: string, customerId) {
    try {
      const voucher = await this.voucherModel.findById(id);
      if (voucher.endDate.getTime() < new Date().getTime()) {
        throw new BadRequestException('PRODUCT_E0013');
      }
      voucher.customerIds = [...voucher.customerIds, customerId];
      await voucher.save();
      return voucher;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // customer request to use a public voucher for a voucher
  async useVoucherByCustomer(id: string, customerId) {
    try {
      const voucher = await this.voucherModel.findById(id);
      const myVoucher = voucher.customerIds.filter((id) => id === customerId);
      if (myVoucher.length === 0) {
        throw new BadRequestException('PRODUCT_E0012');
      }

      if (voucher.endDate.getTime() < new Date().getTime()) {
        throw new BadRequestException('PRODUCT_E0013');
      }

      voucher.usedIds = [...voucher.usedIds, customerId];
      voucher.useTimes = voucher.useTimes + 1;
      await voucher.save();
      return voucher;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // delete by voucher id query and exception handling
  async deleteVoucherById(id: string) {
    try {
      return await this.voucherModel.findByIdAndDelete(id);
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }
}
