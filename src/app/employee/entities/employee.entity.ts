import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export enum Availabilty {
  FREE = 'FREE',
  OCCUPIED = 'OCCUPIED',
}

registerEnumType(Availabilty, {
  name: 'Availabilty',
});

@ObjectType()
@Schema()
export class Employee extends Document {
  @Field(() => ID)
  _id: MongooseSchema.Types.ObjectId;

  @Field(() => String)
  @Prop({ unique: true })
  name: string;

  @Field(() => String)
  @Prop({ type: String, enum: Availabilty, default: Availabilty.FREE })
  availablity: Availabilty;
}

export type EmployeeDocument = Employee & Document;

export const EmployeeSchema = SchemaFactory.createForClass(Employee);
