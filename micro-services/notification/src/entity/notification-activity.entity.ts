import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { Document, ObjectId } from 'mongoose';
import { NotificationDetails } from './notificaions.entity';

export type NotificationActivityDocument = NotificationActivity & Document;

@Schema({ timestamps: true })
export class NotificationActivity {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  notification: NotificationDetails;

  @Prop()
  data: {};

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const NotificationActivitySchema =
  SchemaFactory.createForClass(NotificationActivity);
