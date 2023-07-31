import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, ObjectId } from 'mongoose';
import { Transform } from 'class-transformer';
import { Branch } from './branch.entity';
import { Product } from './product.entity';

export type VoucherDocument = Voucher & Document;

// Database Document for Voucher
@Schema({ timestamps: true })
export class Voucher {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop()
  refferalCode: string;

  @Prop({ required: true })
  value: number;

  @Prop()
  image: string;

  @Prop()
  isAvailable: boolean;

  @Prop()
  isPercentage: boolean;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ default: 0 })
  useTimes: number;

  @Prop()
  useLimit: number;

  @Prop({ required: true })
  minOrderAmount: number;

  @Prop({ required: true })
  discountLimit: number;

  @Prop({ type: Object })
  location: {
    type: string;
    coordinates: { lat: number; long: number }[];
    radiusKm: number;
  };

  @Prop()
  phoneNo: string[];

  @Prop()
  eventType: string;

  @Prop()
  isCustomerSpecific: boolean;

  @Prop()
  usedIds: string[];

  @Prop()
  adminId: string;

  @Prop()
  customerIds: string[];

  @Prop([
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: Branch.name,
      required: true,
    },
  ])
  branchId: Branch[];

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: Product.name }])
  productIds: Product[];

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const VoucherSchema = SchemaFactory.createForClass(Voucher);
