import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Category, CategoryDocument } from 'src/entity/category.entity';

// Services to perform all bussiness and required operations
@Injectable()
export class CategoryRepository {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  // create query and exception handling
  async create(body) {
    try {
      return await this.categoryModel.create(body);
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // search by category id query and exception handling
  async findById(id) {
    try {
      return await this.categoryModel.findById(id).populate('productIds');
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // search by category id query and exception handling
  async findCategoryWithBranchId(id, branchId) {
    try {
      if (branchId) {
        return await this.categoryModel.findById(id).populate({
          path: 'productIds',
          match: { branchIds: { $in: branchId } },
        });
      } else {
        return await this.categoryModel.findById(id).populate('productIds');
      }
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // search by category id query and exception handling
  async findOne(id, query) {
    try {
      const { page = 0, limit = 10 } = query;
      const category = await this.categoryModel.findOne({ _id: id }).exec();
      const totalCount = category.productIds.length;
      const paginatedProductIds = category.productIds.slice(
        page * limit,
        page * limit + limit,
      );
      return {
        paginatedProductIds,
        totalCount,
      };
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // search by category id query and exception handling
  async findCategoryByProductBranch(id) {
    try {
      let category = await this.categoryModel.find({}).populate({
        path: 'productIds',
        match: { branchIds: { $in: id } },
      });
      category = category.filter((cate) => cate.productIds.length > 0);
      return category;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // get all category and exception handling
  async getAllCategories(data) {
    try {
      const { page = 0, limit = 10, sort = 'asc', name, isAvailable } = data;

      let query = {};

      query = {
        ...query,
        ...(name && { name: { $regex: '.*' + name + '.*', $options: 'i' } }),
        ...(isAvailable && { isAvailable }),
      };

      const response = await Promise.all([
        this.categoryModel
          .find(query)
          .populate('productIds')
          .sort({ priority: sort })
          .skip(page * limit)
          .limit(limit),
        this.categoryModel.countDocuments(query),
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

  // search by name query and exception handling
  async findByName(name) {
    try {
      return await this.categoryModel.findOne({ name });
    } catch (error) {
      return true;
    }
  }

  // update multiple products by product ids query and exception handling
  async categoryAutoPublishTime(id: string, autoPublishTime) {
    try {
      return await this.categoryModel.updateOne(
        { _id: id },
        { autoPublishTime: autoPublishTime, isAvailable: false },
      );
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // update by category id query and exception handling
  async updateCategoryById(id: string, body) {
    try {
      const category = await this.categoryModel.findById(id);
      if (body.productIds) {
        body.productIds = [...body.productIds, ...category.productIds];
      }
      return await this.categoryModel.findByIdAndUpdate(id, body, {
        new: true,
      });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // update by category id query and exception handling
  async addProductInCategory(categoryIds: string[], productId) {
    try {
      categoryIds.map(async (id) => {
        const category = await this.categoryModel.findById(id);
        category.productIds = [...category?.productIds, productId];
        category.save();
      });
      return 'Add successfully';
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // update by category id query and exception handling
  async updateProductInCategory(categoryIds: string[], productId) {
    try {
      const categories = await this.categoryModel.find({
        productIds: { $in: productId },
      });
      const CategoryChanged = categories.filter(
        (data) => !categoryIds.includes(data.id),
      );
      CategoryChanged.map(async (categoy) => {
        const category = await this.categoryModel.findById(categoy.id);
        const newIds = category?.productIds.filter(
          (data) => data.toString() !== productId,
        );
        category.productIds = newIds;

        await category.save();
      });
      const CategoryNotChange = categories.filter((data) =>
        categoryIds.includes(data.id),
      );
      const notchangeIds = CategoryNotChange.map((data) => data.id);

      const newUpdatedCategories = categoryIds.filter(
        (id) => !notchangeIds.includes(id),
      );
      newUpdatedCategories.map(async (id) => {
        const category = await this.categoryModel.findById(id);
        category.productIds = [...category?.productIds, productId];
        await category.save();
      });

      return 'Update successfully';
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // update by category id query and exception handling
  async updateMultipleCategoryByIds(ids: string[], isAvailable) {
    try {
      return await this.categoryModel.updateMany(
        { _id: { $in: ids } },
        { isAvailable: isAvailable },
        { new: true },
      );
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // delete by category id query and exception handling
  async deleteCategoryById(id: string) {
    try {
      return await this.categoryModel.findByIdAndDelete(id);
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // delete by categories ids array query and exception handling
  async deleteCategoriesByIds(ids: string[]) {
    try {
      return await this.categoryModel.deleteMany({ _id: { $in: ids } });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // delete by categories ids array query and exception handling
  async removeProductFromCategory(id: string, productId: string) {
    try {
      const category = await this.categoryModel.findOne({
        productIds: productId,
        _id: id,
      });
      if (!category) {
        throw new BadRequestException('PRODUCT_E0008');
      }
      const ids = category.productIds.filter(
        (id) => id.toString() !== productId,
      );
      category.productIds = ids;
      await category.save();
      return category;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // update all old categories by +1 in priority field
  async updateCategoryPriorityIncrement() {
    try {
      const update = { $inc: { priority: 1 } };
      await this.categoryModel.updateMany({}, update);
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // update changed category by new priority field value
  async updateCategoryPriority(id, priority) {
    try {
      return await this.categoryModel.updateOne({ _id: id }, { priority });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // helper function for cron job
  async getAllUnPublishCategory() {
    try {
      return await this.categoryModel.find({ isAvailable: false });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // helper function for cron job
  async getAllCategory() {
    try {
      return await this.categoryModel.find({
        IsTimeSpecific: true,
      });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // update multiple products by product ids query and exception handling
  async categoryAutoPublishCronJob(ids) {
    try {
      return await this.categoryModel.updateMany(
        { _id: { $in: ids } },
        { isAvailable: true },
        { new: true },
      );
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // update multiple products by product ids query and exception handling
  async categoryUnPublishCronJob(ids) {
    try {
      return await this.categoryModel.updateMany(
        { _id: { $in: ids } },
        { isAvailable: false, IsTimeSpecific: false },
        { new: true },
      );
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }
}
