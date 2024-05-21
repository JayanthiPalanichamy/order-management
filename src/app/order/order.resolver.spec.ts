import { Test, TestingModule } from '@nestjs/testing';
import { OrderResolver } from './order.resolver';
import { OrderService } from './order.service';
import { CreateOrderInput } from './dto/create-order.input';
import { Schema } from 'mongoose';
import { Chance } from 'chance';
import { OrderStatus } from './status/order-status';
import { UpdateOrderInput } from './dto/update-order.input';
import { Availabilty } from '../employee/entities/employee.entity';
import { ListOrderInput } from './dto/list-order.input';

describe('OrderResolver', () => {
  let resolver: OrderResolver;
  const chance = new Chance();
  const orderId = new Schema.Types.ObjectId('');
  const employeeId = new Schema.Types.ObjectId('');
  const createOrderInput: CreateOrderInput = {
    name: chance.name(),
    lineItems: ['milk', 'bread'],
  };

  const mockService = {
    create: jest.fn(() => {
      return {
        _id: orderId,
        ...createOrderInput,
        status: OrderStatus.OPEN.id,
      };
    }),
    getById: jest.fn(() => {
      return {
        _id: orderId,
        ...createOrderInput,
        status: OrderStatus.OPEN.id,
      };
    }),
    list: jest.fn(() => {
      return [
        {
          _id: orderId,
          ...createOrderInput,
          status: OrderStatus.OPEN.id,
        },
      ];
    }),
    update: jest.fn(() => {
      return {
        _id: orderId,
        ...createOrderInput,
        status: OrderStatus.IN_PROGRESS.id,
        employee: {
          _id: employeeId,
          name: chance.name(),
          availabilty: Availabilty.OCCUPIED,
        },
      };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderResolver,
        {
          provide: OrderService,
          useValue: mockService,
        },
      ],
    }).compile();

    resolver = module.get<OrderResolver>(OrderResolver);
  });

  it('should be able to create an order', async () => {
    const order = await resolver.createOrder(createOrderInput);
    expect(order._id).toBeDefined();
    expect(order._id).toBe(orderId);
    expect(order.name).toBe(createOrderInput.name);
  });

  it('should be able to list all order', async () => {
    const listOrderInput: ListOrderInput = {
      status: OrderStatus.OPEN.id,
    };
    const orders = await resolver.orders(listOrderInput);
    expect(orders).toBeDefined();
    expect(Array.isArray(orders)).toBe(true);
    expect(orders[0]._id).toBe(orderId);
  });

  it('should be able to find one order by id', async () => {
    const order = await resolver.order(orderId);
    expect(order).toBeDefined();
    expect(order._id).toBe(orderId);
  });

  it('should be update order to next order status', async () => {
    const updateOrderInput: UpdateOrderInput = {
      _id: orderId,
      status: OrderStatus.IN_PROGRESS.id,
    };
    const order = await resolver.updateOrder(updateOrderInput);
    expect(order).toBeDefined();
    expect(order._id).toBe(orderId);
    expect(order.status).toBe(updateOrderInput.status);
    expect(order.employee).toBeDefined();
  });
});
