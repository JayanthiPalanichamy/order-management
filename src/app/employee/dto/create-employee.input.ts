import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateEmployeeInput {
  @Field(() => String)
  name: string;
}
