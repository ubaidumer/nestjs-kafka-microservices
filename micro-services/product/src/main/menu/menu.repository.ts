import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Menu, MenuDocument } from 'src/entity/menu.entity';

// Services to perform all bussiness and required operations
@Injectable()
export class MenuRepository {
  constructor(@InjectModel(Menu.name) private menuModel: Model<MenuDocument>) {}

  // create query and exception handling
  async create(body) {
    try {
      return await this.menuModel.create(body);
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // search by menu id query and exception handling
  async findById(id) {
    try {
      return await this.menuModel.findById(id);
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // get all menus and exception handling
  async getAllMenus(data) {
    try {
      const { page = 0, limit = 10, sort = 'desc', name } = data;

      let query = {};

      query = {
        ...query,
        ...(name && { name: { $regex: '.*' + name + '.*', $options: 'i' } }),
      };

      const response = await Promise.all([
        this.menuModel
          .find(query)
          .sort({ createdAt: sort })
          .skip(page * limit)
          .limit(limit),
        this.menuModel.countDocuments(query),
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
  async updateMenuById(id: string, body) {
    try {
      return await this.menuModel.findByIdAndUpdate(id, body, { new: true });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // delete by menu id query and exception handling
  async deleteMenuById(id: string) {
    try {
      return await this.menuModel.findByIdAndDelete(id);
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }
}
