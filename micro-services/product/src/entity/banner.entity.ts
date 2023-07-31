import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, ObjectId } from 'mongoose';
import { Transform } from 'class-transformer';
import {
  bannerPlatformCategory,
  bannerPlatformCategoryType,
} from 'src/utils/constant/banner';
import { Branch } from './branch.entity';

export type BannerDocument = Banner & Document;

// Database Document for Banner
@Schema({ timestamps: true })
export class Banner {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop()
  name: string;

  @Prop({ required: true, default: 0 })
  priority: number;

  @Prop({
    required: true,
    type: [{ type: String, enum: bannerPlatformCategory }],
  })
  platform: bannerPlatformCategoryType[];

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: Branch.name }])
  branchIds: Branch[];

  @Prop()
  websiteImage: string;

  @Prop()
  applicationImage: string;

  @Prop({ default: false })
  isAvailable: boolean;

  @Prop({ required: true })
  IsTimeSpecific: boolean;

  @Prop()
  publishStartTime: Date;

  @Prop()
  publishEndTime: Date;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const BannerSchema = SchemaFactory.createForClass(Banner);
