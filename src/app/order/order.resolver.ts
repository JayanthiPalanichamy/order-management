import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Schema as MongooseSchema } from 'mongoose';
import { OrderService } from './order.service';
import { Order } from './entities/order.entity';
import { CreateOrderInput } from './dto/create-order.input';
import { UpdateOrderInput } from './dto/update-order.input';
import { ListOrderInput } from './dto/list-order.input';

@Resolver(() => Order)
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  @Mutation(() => Order)
  async createOrder(
    @Args('createOrderInput') createOrderInput: CreateOrderInput,
  ): Promise<Order> {
    return this.orderService.create(createOrderInput);
  }

  @Query(() => Order, { name: 'Order' })
  async order(
    @Args('_id', { type: () => String }) _id: MongooseSchema.Types.ObjectId,
  ): Promise<Order> {
    return this.orderService.getById(_id);
  }

  @Query(() => [Order])
  async orders(
    @Args('filters', { nullable: true }) filters?: ListOrderInput,
  ): Promise<Order[]> {
    return this.orderService.list(filters);
  }

  @Mutation(() => Order)
  async updateOrder(
    @Args('UpdateOrderInput') updateOrderInput: UpdateOrderInput,
  ): Promise<Order> {
    return await this.orderService.update(updateOrderInput);
  }
}
