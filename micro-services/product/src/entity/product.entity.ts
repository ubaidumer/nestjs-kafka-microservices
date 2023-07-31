import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, ObjectId, Schema as schema } from 'mongoose';
import { Transform } from 'class-transformer';
import { Menu } from './menu.entity';
import { Branch } from './branch.entity';
import { selectionEnum } from 'src/utils/constant/productConstant';
import { AddOns } from './addOns.entity';

// Product options fields
export class Options {
  @Prop()
  title: string;

  @Prop()
  isRequired: boolean;

  @Prop()
  isMultiSelectable: boolean;

  @Prop()
  variations: variation[];
}

// Product variation fields
export class variation {
  @Prop()
  name: string;

  @Prop()
  price: number;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: AddOns.name }])
  addOnsIds: AddOns[];
}

export type ProductDocument = Product & Document;

// Database Document for Product
@Schema({ timestamps: true })
export class Product {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop({ type: String, required: true, unique: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  prepTime: number;

  @Prop({ required: true })
  selectionEnum: selectionEnum[];

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: AddOns.name }])
  addOnsIds: AddOns[];

  @Prop()
  dealItems: {
    heading: string;
    required: boolean;
    productId: { type: mongoose.Schema.Types.ObjectId; ref: 'products' };
    options: Options[];
    quantity: number;
  }[];

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: Menu.name }])
  menuIds: Menu[];

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: Branch.name }])
  branchIds: Branch[];

  @Prop()
  options: Options[];

  @Prop()
  image: string;

  @Prop({ required: true })
  SKU: string;

  @Prop()
  autoPublishTime: Date;

  @Prop({ default: 0 })
  revenue: number;

  @Prop()
  facilities: string[];

  @Prop({ default: true })
  isAvailable: boolean;

  @Prop({ required: true })
  isDeal: boolean;

  @Prop({ required: true })
  description: string;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
