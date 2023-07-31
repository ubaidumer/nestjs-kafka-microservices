import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { Document, ObjectId } from 'mongoose';

export type FcmTokenDocument = FcmToken & Document;

@Schema({ timestamps: true })
export class FcmToken {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  token: string;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const FcmTokenSchema = SchemaFactory.createForClass(FcmToken);
