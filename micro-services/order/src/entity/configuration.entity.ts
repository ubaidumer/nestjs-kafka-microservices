import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, ObjectId } from 'mongoose';
import { Transform } from 'class-transformer';

export type ConfigurationDocument = Configuration & Document;

// Database Document for Category
@Schema({ timestamps: true })
export class Configuration {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop()
  orderManualAcceptance: boolean;

  @Prop()
  amount: number;

  //Time in minutes
  @Prop({ default: 5 })
  adminAcceptanceTimeLimit: number;

  //Time in minutes
  @Prop({ default: 5 })
  riderAssigningTimeLimit: number;

  //Time in minutes
  @Prop({ default: 5 })
  riderAcceptanceTimeLimit: number;

  //Time in minutes
  @Prop({ default: 5 })
  riderPickupTimeLimit: number;

  //Time in minutes
  @Prop({ default: 5 })
  OrderCancelTimeLimit: number;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const ConfigurationSchema = SchemaFactory.createForClass(Configuration);
