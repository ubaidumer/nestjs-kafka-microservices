import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Banner, BannerDocument } from 'src/entity/banner.entity';

// Services to perform all bussiness and required operations
@Injectable()
export class BannerRepository {
  constructor(
    @InjectModel(Banner.name) private BannerModel: Model<BannerDocument>,
  ) {}

  // create query and exception handling
  async create(body) {
    try {
      return await this.BannerModel.create(body);
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // search by Banner id query and exception handling
  async findById(id) {
    try {
      return await this.BannerModel.findById(id);
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // get all Banner and exception handling
  async findAllBanners(data) {
    try {
      const {
        page = 0,
        limit = 10,
        sort = 'asc',
        name,
        isAvailable,
        branchId,
      } = data;

      let query = {};

      query = {
        ...query,
        ...(name && { name: { $regex: '.*' + name + '.*', $options: 'i' } }),
        ...(isAvailable && { isAvailable }),
        ...(branchId && { branchIds: { $in: branchId } }),
      };

      const response = await Promise.all([
        this.BannerModel.find(query)
          .sort({ priority: sort })
          .skip(page * limit)
          .limit(limit),
        this.BannerModel.countDocuments(query),
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
      return await this.BannerModel.findOne({ name });
    } catch (error) {
      return true;
    }
  }

  // update by Banner id query and exception handling
  async updateBannerById(id: string, body) {
    try {
      return await this.BannerModel.findByIdAndUpdate(id, body, {
        new: true,
      });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // update by Banner id query and exception handling
  async updateMultipleBannerByIds(ids: string[], isAvailable) {
    try {
      return await this.BannerModel.updateMany(
        { _id: { $in: ids } },
        { isAvailable: isAvailable },
        { new: true },
      );
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // delete by Banner id query and exception handling
  async deleteBannerById(id: string) {
    try {
      return await this.BannerModel.findByIdAndDelete(id);
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // delete by Banners ids array query and exception handling
  async deleteBannersByIds(ids: string[]) {
    try {
      return await this.BannerModel.deleteMany({ _id: { $in: ids } });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // update all old Banners by +1 in priority field
  async updateBannerPriorityIncrement() {
    try {
      const update = { $inc: { priority: 1 } };
      await this.BannerModel.updateMany({}, update);
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // update changed Banner by new priority field value
  async updateBannerPriority(id, priority) {
    try {
      return await this.BannerModel.updateOne({ _id: id }, { priority });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // helper function for cron job
  async getAllUnPublishBanner() {
    try {
      return await this.BannerModel.find({ isAvailable: false });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // helper function for cron job
  async getAllBanner() {
    try {
      return await this.BannerModel.find({
        IsTimeSpecific: true,
      });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // update multiple products by product ids query and exception handling
  async BannerAutoPublishCronJob(ids) {
    try {
      return await this.BannerModel.updateMany(
        { _id: { $in: ids } },
        { isAvailable: true },
        { new: true },
      );
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // update multiple products by product ids query and exception handling
  async BannerUnPublishCronJob(ids) {
    try {
      return await this.BannerModel.updateMany(
        { _id: { $in: ids } },
        { isAvailable: false, IsTimeSpecific: false },
        { new: true },
      );
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }
}
