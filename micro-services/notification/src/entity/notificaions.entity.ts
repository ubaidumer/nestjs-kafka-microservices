import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { Document, ObjectId } from 'mongoose';

export type NotificationDocument = Notification & Document;

export class NotificationDetails {
  @Prop()
  title: string;

  @Prop()
  body: string;
}

@Schema({ timestamps: true })
export class Notification {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop()
  userId: string;

  @Prop({ type: Object })
  data: object;

  @Prop({ required: true })
  notification: NotificationDetails;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
