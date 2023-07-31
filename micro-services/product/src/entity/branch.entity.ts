import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Schema as schema } from 'mongoose';
import { Transform } from 'class-transformer';
import { DaysEnum } from 'src/utils/constant/productConstant';
import { Coordinates } from 'src/utils/constant/coordinates';
export type BranchDocument = Branch & Document;

// location object details and properties
export class Location {
  @Prop()
  type: string;

  @Prop()
  coordinates: Coordinates[];
}

// location object details and properties
export class DeliveryArea {
  @Prop({ type: String, enum: ['Polygon'], required: true })
  type;

  @Prop({ type: [[[Number]]], required: true })
  coordinates;
}

// Database Document for Branch
@Schema({ timestamps: true, autoIndex: true })
export class Branch {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop({ unique: true, required: true })
  name: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  region: string;

  @Prop({ required: true })
  facilities: string[];

  @Prop()
  image: string;

  @Prop()
  adminIds: string[];

  @Prop({ default: 'ACTIVE' })
  status: string;

  @Prop()
  phoneNo: string;

  @Prop({ default: true })
  isAvailable: boolean;

  @Prop()
  branchTiming: {
    day: DaysEnum;
    timing: { startTime: string; endTime: string }[];
  }[];

  @Prop()
  specialTiming: { date: Date; startTime: string; endTime: string }[];

  @Prop()
  location: Location;

  @Prop({ index: '2dsphere' })
  deliveryArea: DeliveryArea;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const BranchSchema = SchemaFactory.createForClass(Branch).index({
  deliveryArea: '2dsphere',
  location: '2dsphere',
});
