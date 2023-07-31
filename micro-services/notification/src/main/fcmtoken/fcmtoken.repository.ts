import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FcmToken, FcmTokenDocument } from 'src/entity/fcm-token.entity';

// Services to perform all bussiness and required operations
@Injectable()
export class FcmTokenRepository {
  constructor(
    @InjectModel(FcmToken.name)
    private fcmTokenModel: Model<FcmTokenDocument>,
  ) {}

  // create query and exception handling
  async create(body) {
    try {
      return await this.fcmTokenModel.updateOne({ userId: body.userId }, body, {
        upsert: true,
      });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // search by fcmtoken id query and exception handling
  async findById(id) {
    try {
      return await this.fcmTokenModel.findById(id);
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // search by user id query and exception handling
  async findByUserId(userId) {
    try {
      return await this.fcmTokenModel.findOne({ userId });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // find all fcmtokens and exception handling
  async findAllFcmToken(query) {
    try {
      const { page = 0, limit = 10 } = query;
      return await this.fcmTokenModel
        .find()
        .skip(page * limit)
        .limit(limit);
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // update by user id query and exception handling
  async updateToken(userId: string, token) {
    try {
      return await this.fcmTokenModel.findByIdAndUpdate(userId, token);
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }
}
