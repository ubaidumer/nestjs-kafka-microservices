import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, ObjectId } from 'mongoose';
import { Transform } from 'class-transformer';
import { Order } from './order.entity';

export type OrderActivityDocument = OrderActivity & Document;

class deviceInfo {
  @Prop()
  ipAddress: string;

  @Prop()
  deviceType: string;
}

// Database Document for Order Activity
@Schema({ timestamps: true })
export class OrderActivity {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Order.name })
  orderId: Order;

  @Prop()
  orderStatus: string;

  @Prop()
  adminId: string;

  @Prop()
  customerId: string;

  @Prop()
  riderId: string;

  @Prop()
  description: string;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const OrderActivitySchema = SchemaFactory.createForClass(OrderActivity);
