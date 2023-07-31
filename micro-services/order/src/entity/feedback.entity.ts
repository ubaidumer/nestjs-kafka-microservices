import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import { Transform } from 'class-transformer';

export type FeedbackDocument = Feedback & Document;

// Database Document for Feedback
@Schema({ timestamps: true })
export class Feedback {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop()
  message: string;

  @Prop({ required: true })
  stars: number;

  @Prop({ required: true })
  customerId: string;

  @Prop({ required: true })
  orderId: string;

  @Prop()
  serviceSuggestions: string[];

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);
