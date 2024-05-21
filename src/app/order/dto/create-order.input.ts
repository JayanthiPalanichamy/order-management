import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateOrderInput {
  @Field(() => String)
  name: string;

  @Field(() => [String])
  lineItems: string[];
}
