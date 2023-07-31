import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Configuration,
  ConfigurationDocument,
} from 'src/entity/configuration.entity';

@Injectable()
export class ConfigurationRepository {
  constructor(
    @InjectModel(Configuration.name)
    private configurationModel: Model<ConfigurationDocument>,
  ) {}

  // create query and exception handling
  async create(body) {
    try {
      return await this.configurationModel.create(body);
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // get all order activities and exception handling
  async findById(id) {
    try {
      return this.configurationModel.findById(id);
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // get all order activities and exception handling
  async findOne() {
    try {
      return this.configurationModel.findOne();
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // get all order activities and exception handling
  async update(id, data) {
    try {
      const _data = await this.findById(id);
      if (!_data) {
        throw new BadRequestException('ORDER_E0007');
      }
      return this.configurationModel.findByIdAndUpdate(id, data, {
        new: true,
      });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }
}
