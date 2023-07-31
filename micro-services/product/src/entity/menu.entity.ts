import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import { Transform } from 'class-transformer';

export type MenuDocument = Menu & Document;

// Database Document for Menu
@Schema({ timestamps: true })
export class Menu {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  image: string;

  @Prop({ required: true })
  isAvailable: boolean;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const MenuSchema = SchemaFactory.createForClass(Menu);
