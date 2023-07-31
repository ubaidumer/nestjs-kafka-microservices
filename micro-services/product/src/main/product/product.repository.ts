import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from 'src/entity/product.entity';
import { AddonsRepository } from '../addons/addons.repository';

// Services to perform all bussiness and required operations
@Injectable()
export class ProductRepository {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private readonly addOnsRepo: AddonsRepository,
  ) {}

  // create query and exception handling
  async create(body) {
    try {
      // body.createdAt = new Date();
      const product = await this.productModel.find({ name: body.name });
      if (product) {
      }
      return await this.productModel.create(body);
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // search by product id query and exception handling
  async findById(id) {
    try {
      const product = await this.productModel.findById(id).populate({
        path: 'addOnsIds',
        model: 'AddOns', // Replace "Addon" with the actual name of the Mongoose model for Addons
      });

      for (let i = 0; i < product.options?.length; i++) {
        for (let j = 0; j < product.options[i].variations.length; j++) {
          const addons = await this.addOnsRepo.findAddOnsByMultipleIds(
            product.options[i].variations[j].addOnsIds,
          );
          product.options[i].variations[j].addOnsIds = addons;
        }
      }

      return product;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // search multiple products by product ids array query and exception handling
  async findMultipleProductsByIds(ids) {
    try {
      return await this.productModel.find({
        _id: { $in: ids },
      });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }
  // search multiple products by product ids array query and exception handling
  async getProductByIds(ids) {
    try {
      return await this.productModel.find({
        _id: { $in: ids },
      });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // search by selection enum value id query and exception handling
  async findProductBySelectionEnum(body) {
    try {
      const { page = 0, limit = 10, selectionEnum, sort = 'desc' } = body;

      let query = {};
      if (selectionEnum) {
        query = { selectionEnum: { $in: selectionEnum } };
      }

      const response = await Promise.all([
        this.productModel
          .find(query)
          .sort({ createdAt: sort })
          .skip(page * limit)
          .limit(limit),
        this.productModel.countDocuments(query),
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

  // search by product name query and exception handling
  async getProductByName(search) {
    try {
      return await this.productModel.find({
        name: { $regex: '.*' + search + '.*', $options: 'i' },
      });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // search by name query and exception handling
  async findByName(name) {
    try {
      return await this.productModel.findOne({ name });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // search by name query and exception handling
  async findAllProductsByCoordinates(branchId) {
    try {
      return await this.productModel.find({ branchIds: branchId });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }
  // search by category id query and exception handling
  async getProductByCategory(search, body) {
    try {
      const { page = 0, limit = 10, sort = 'desc' } = body;

      const response = await Promise.all([
        this.productModel
          .find()
          .populate('addOnsIds')
          .sort({ createdAt: sort })
          .skip(page * limit)
          .limit(limit),
        this.productModel.countDocuments(),
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

  // get all products by selection enum, isDeal and exception handling
  async findAllProductsBySelectionEnum(body) {
    try {
      const { page = 0, limit = 10, sort = 'desc' } = body;
      // const queryObject = { isDeal, selectionEnum };

      const selectionEnum = body.selectionEnum?.split(',');

      const isDeal = body.isDeal?.split(',');

      let query = {};
      if (selectionEnum?.length > 0) {
        query = { selectionEnum: { $in: selectionEnum } };
      }
      if (isDeal?.length > 0) {
        query = { isDeal: { $in: isDeal } };
      }

      const response = await Promise.all([
        this.productModel
          .find(query)
          .populate('addOnsIds')
          .sort({ createdAt: sort })
          .skip(page * limit)
          .limit(limit),
        this.productModel.countDocuments(query),
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

  // get all products with query params and exception handling
  async findAllProductsName(body) {
    try {
      const { page = 0, limit = 10, name, sort = 'desc', branchId } = body;

      let query = {};

      query = {
        ...query,
        ...(name && { name: { $regex: '.*' + name + '.*', $options: 'i' } }),
        ...(branchId && { branchIds: { $in: branchId } }),
      };

      const response = await Promise.all([
        this.productModel
          .find(query)
          .populate('addOnsIds')
          .sort({ createdAt: sort })
          .skip(page * limit)
          .limit(limit),
        this.productModel.countDocuments(query),
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

  // update by products id query and exception handling
  async updateProductById(id: string, body) {
    try {
      return await this.productModel.findByIdAndUpdate(id, body, { new: true });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // update multiple products by product ids query and exception handling
  async updateMultipleProductsByIds(ids: string[], isAvailable, categoryId) {
    try {
      return await this.productModel.updateMany(
        { _id: { $in: ids } },
        { isAvailable: isAvailable, categoryId: categoryId },
      );
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // update multiple products by product ids query and exception handling
  async productAutoPublishTime(id: string, autoPublishTime) {
    try {
      return await this.productModel.updateOne(
        { _id: id },
        { autoPublishTime: autoPublishTime, isAvailable: false },
      );
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // update multiple products by product ids query and exception handling
  async productAutoPublishCronJob(ids) {
    try {
      return await this.productModel.updateMany(
        { _id: { $in: ids } },
        { isAvailable: true },
      );
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // delete by products id query and exception handling
  async deleteProductById(id: string) {
    try {
      return await this.productModel.findByIdAndDelete(id);
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // delete by products ids array query and exception handling
  async deleteProductsByIds(ids: string[]) {
    try {
      return await this.productModel.deleteMany({ _id: { $in: ids } });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // saga utils

  // delete by products ids array query and exception handling
  async addrevenueInProduct(product) {
    try {
      const data = await this.productModel.findById(product.id);
      if (!data) return;
      data.revenue = data.revenue + product.revenue;
      await data.save();
      return data;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // helper function for cron job
  async getAllProduct() {
    try {
      return await this.productModel.find({ isAvailable: false });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }
}
