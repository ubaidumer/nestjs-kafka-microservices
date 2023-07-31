import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AddOns, AddOnsDocument } from 'src/entity/addOns.entity';

// Services to perform all bussiness and required operations
@Injectable()
export class AddonsRepository {
  constructor(
    @InjectModel(AddOns.name) private addonsModel: Model<AddOnsDocument>,
  ) {}

  // create query and exception handling
  async create(body) {
    try {
      return await this.addonsModel.create(body);
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // search by menu id query and exception handling
  async findById(id) {
    try {
      return await this.addonsModel.findById(id);
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // search by menu id query and exception handling
  async findAddOnsByMultipleIds(ids) {
    try {
      return await this.addonsModel.find({ _id: { $in: ids } });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // search by menu id query and exception handling
  async findAllAddonstypes() {
    try {
      return await this.addonsModel.distinct('type');
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // search by menu id query and exception handling
  async findAllAddonsObjecttypes() {
    try {
      const types = await this.addonsModel.distinct('type');
      let result = [];
      for (let i = 0; i <= types.length - 1; i++) {
        const data = await this.addonsModel.find({ type: types[i] });
        result.push({ type: types[i], addons: data });
      }
      return result;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // find all menus and exception handling
  async findAllAddons(data) {
    try {
      const { page = 0, limit = 10, sort = 'desc', name } = data;

      let query = {};

      query = {
        ...query,
        ...(name && { name: { $regex: '.*' + name + '.*', $options: 'i' } }),
      };

      const response = await Promise.all([
        this.addonsModel
          .find(query)
          .sort({ createdAt: sort })
          .skip(page * limit)
          .limit(limit),
        this.addonsModel.countDocuments(query),
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

  // update by menu id query and exception handling
  async updateAddonsById(id: string, body) {
    try {
      return await this.addonsModel.findByIdAndUpdate(id, body, { new: true });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // delete by menu id query and exception handling
  async deleteAddonsById(id: string) {
    try {
      return await this.addonsModel.findByIdAndDelete(id);
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }
}
