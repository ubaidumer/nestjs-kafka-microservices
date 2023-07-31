import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import { Transform } from 'class-transformer';

export type AddOnsDocument = AddOns & Document;

export class variation {
  @Prop({ required: true })
  name: string;

  @Prop()
  image: string;

  @Prop()
  price: number;
}

// Database Document for Menu
@Schema({ timestamps: true })
export class AddOns {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  variations: variation[];

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const AddOnsSchema = SchemaFactory.createForClass(AddOns);
