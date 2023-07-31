import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, ObjectId } from 'mongoose';
import { Transform } from 'class-transformer';

export type PaymentDocument = Payment & Document;

// Database Document for Category
@Schema({ timestamps: true })
export class Payment {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop({ required: true })
  paymentMethod: string;

  @Prop({ required: true })
  customerGatewayId: string;

  @Prop({ required: true })
  customerId: string;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
