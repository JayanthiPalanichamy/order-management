import { Field, ObjectType } from '@nestjs/graphql';
import { Employee } from '../../employee/entities/employee.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { OrderStatus } from '../status/order-status';

@ObjectType()
@Schema({ timestamps: true })
export class Order extends Document {
  @Field(() => String)
  _id: MongooseSchema.Types.ObjectId;

  @Field(() => String)
  @Prop()
  name: string;

  @Field(() => String)
  @Prop({
    type: String,
    required: true,
    default: OrderStatus.OPEN.id,
  })
  status: string;

  @Field(() => Employee, { nullable: true })
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: false,
    ref: Employee.name,
  })
  employee?: MongooseSchema.Types.ObjectId;

  @Prop()
  @Field(() => Date, { description: 'Created At' })
  createdAt?: Date;

  @Prop()
  @Field(() => Date, { description: 'Updated At' })
  updatedAt?: Date;
}

export type OrderDocument = Order & Document;

export const OrderSchema = SchemaFactory.createForClass(Order);
