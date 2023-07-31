import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, ObjectId } from 'mongoose';
import { Transform } from 'class-transformer';
import { Product } from './product.entity';

export type CategoryDocument = Category & Document;

// Database Document for Category
@Schema({ timestamps: true })
export class Category {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop({ unique: true })
  name: string;

  @Prop({ required: true, default: 0 })
  priority: number;

  @Prop({ required: true })
  image: string;

  @Prop({ required: true })
  isAvailable: boolean;

  @Prop({ required: true })
  IsTimeSpecific: boolean;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: Product.name }])
  productIds: Product[];

  @Prop()
  createdAt?: Date;

  @Prop()
  autoPublishTime: Date;

  @Prop()
  publishStartTime: Date;

  @Prop()
  publishEndTime: Date;

  @Prop()
  updatedAt?: Date;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
