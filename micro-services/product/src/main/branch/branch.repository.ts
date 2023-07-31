import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Branch, BranchDocument } from 'src/entity/branch.entity';

// Services to perform all bussiness and required operations
@Injectable()
export class BranchRepository {
  constructor(
    @InjectModel(Branch.name) private branchModel: Model<BranchDocument>,
  ) {}

  // create query and exception handling
  async create(body) {
    try {
      return await this.branchModel.create(body);
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // search by branch id query and exception handling
  async findById(branchIds) {
    try {
      return await this.branchModel.find({ _id: { $in: branchIds } });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // search by branch id query and exception handling
  async findBranchByCoordinates(lat, long) {
    try {
      return await this.branchModel.findOne({
        deliveryArea: {
          $geoIntersects: {
            $geometry: { type: 'Point', coordinates: [long, lat] },
          },
        },
      });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // search by branch name query and exception handling
  async findByName(name) {
    return await this.branchModel.findOne({ name });
  }

  // get all branches and exception handling
  async getAllBranches(data) {
    try {
      const {
        page = 0,
        limit = 10,
        sort = 'desc',
        name,
        region,
        city,
        adminId,
      } = data;

      let query = {};

      query = {
        ...query,
        ...(name && { name: { $regex: '.*' + name + '.*', $options: 'i' } }),
        ...(region && {
          region,
        }),
        ...(city && {
          city,
        }),
        ...(adminId && {
          adminIds: { $in: adminId },
        }),
      };

      const response = await Promise.all([
        this.branchModel
          .find(query)
          .sort({ createdAt: sort })
          .skip(page * limit)
          .limit(limit),
        this.branchModel.countDocuments(query),
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

  // update by branch id query and exception handling
  async updateBranchById(id: string, body) {
    try {
      return await this.branchModel.findByIdAndUpdate(id, body, { new: true });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // update by branch id query and exception handling
  async updateBranchTiming(id: string, body) {
    try {
      return await this.branchModel.findByIdAndUpdate(id, body, { new: true });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // delete by branch id query and exception handling
  async deleteBranchById(id: string) {
    try {
      return await this.branchModel.findByIdAndDelete(id);
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // saga utils

  // saga query method of repository for nested object initialization
  async findUsingQuery() {
    try {
      return await this.branchModel.find();
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }
  // saga query method of repository for nested object initialization
  async adminFindAllBranchIds() {
    try {
      return await this.branchModel.find({}, '_id');
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async countUsingQuery() {
    try {
      return await this.branchModel.countDocuments();
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // update by branch id query and exception handling
  async updateAdminIdsBranch(adminId: string, branchIds) {
    try {
      const branchData = await this.branchModel.find({
        _id: { $in: branchIds },
      });
      await this.branchModel.updateMany(
        { _id: { $in: branchIds } },
        { $addToSet: { adminIds: adminId } },
      );
      return branchData;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }
}
