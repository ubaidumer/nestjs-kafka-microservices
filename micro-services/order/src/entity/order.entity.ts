import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { now, Document, ObjectId } from 'mongoose';
import { Transform } from 'class-transformer';
import { Payment } from './payment.entity';
import { Feedback } from './feedback.entity';
import {
  lateStatusCategory,
  lateStatusCategoryType,
} from 'src/utils/constants/orderConstants';

// product variations object details and properties
class Address {
  @Prop()
  location: string;

  @Prop()
  landmark: string;

  @Prop()
  addressType: string;

  @Prop()
  specialInstructions: string;

  @Prop()
  lat: number;

  @Prop()
  long: number;
}

class ProductVariations {
  @Prop()
  name: string;

  @Prop()
  quantity: number;

  @Prop()
  price: number;
}

// product options object details and properties
class ProductOptions {
  @Prop()
  title: string;

  @Prop()
  variations: ProductVariations[];
}

// order items object details and properties
class orderItems {
  @Prop()
  productId: string;

  @Prop()
  productName: string;

  @Prop()
  productPrepTime: number;

  @Prop()
  productQuantity: number;

  @Prop()
  productOptions: ProductOptions;

  @Prop()
  specialInstruction: string;
}

class deviceInfo {
  @Prop()
  id: string;

  @Prop()
  type: string;

  @Prop()
  brand: string;

  @Prop()
  model: string;
}

class clientInfo {
  @Prop()
  name: string;

  @Prop()
  type: string;

  @Prop()
  version: string;
}

// order items object details and properties
class reqInfo {
  @Prop()
  osInfo: string;

  @Prop()
  deviceInfo: deviceInfo;

  @Prop()
  clientInfo: clientInfo;
}

export type OrderDocument = Order & Document;

// Database Document for Category
@Schema({ timestamps: true })
export class Order {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop()
  subTotal: number;

  @Prop()
  orderNo: string;

  @Prop()
  reqInfo: reqInfo;

  @Prop()
  total: number;

  @Prop()
  deliveryCharges: number;

  @Prop()
  deliveryPrepTime: number;

  @Prop()
  tax: number;

  @Prop()
  alternatePhoneNo: string[];

  @Prop()
  status: string;

  @Prop()
  reason: string;

  @Prop()
  reasonSubject: string;

  @Prop({ required: true })
  customerPhoneNo: string;

  @Prop({ required: true })
  address: Address;

  @Prop({ required: true })
  type: string;

  @Prop()
  customerNotes: string;

  @Prop()
  cancelationNotes: string;

  @Prop()
  adminRejectedNotes: string;

  @Prop()
  riderRejectedReason: string;

  @Prop()
  orderItems: orderItems[];

  @Prop()
  branchId: string;

  @Prop()
  adminId: string;

  @Prop()
  customerId: string;

  @Prop()
  riderId: string;

  @Prop({
    default: [],
    type: [{ type: String, enum: lateStatusCategory }],
  })
  lateStatus: lateStatusCategoryType[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Payment.name })
  paymentId: Payment;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Feedback.name })
  feedbackId: Feedback;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

const OrderSchema = SchemaFactory.createForClass(Order);

export { OrderSchema };
