import { Field, InputType, PartialType } from '@nestjs/graphql';
import { Schema as MongooseSchema } from 'mongoose';
import { Availabilty } from '../entities/employee.entity';
import { CreateEmployeeInput } from './create-employee.input';

@InputType()
export class ListEmployeeInput extends PartialType(CreateEmployeeInput) {
  @Field(() => String, { nullable: true })
  _id?: MongooseSchema.Types.ObjectId;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  availablity?: Availabilty;
}
