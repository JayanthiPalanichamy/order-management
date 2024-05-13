import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './entities/order.entity';
import { EmployeeService } from '../employee/employee.service';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../common/helpers/mongoose.helper';
import { CreateOrderInput } from './dto/create-order.input';
import { Chance } from 'chance';
import { Schema } from 'mongoose';
import { OrderStatus } from './status/order-status';
import { ListOrderInput } from './dto/list-order.input';
import { UpdateOrderInput } from './dto/update-order.input';
import { HttpException } from '@nestjs/common';
import { Employee, EmployeeSchema } from '../employee/entities/employee.entity';
import { CreateEmployeeInput } from '../employee/dto/create-employee.input';

describe('OrderService', () => {
  let service: OrderService;
  let employeeService: EmployeeService;
  let module: TestingModule;
  const chance = new Chance();
  let orderId = new Schema.Types.ObjectId('');
  const createOrderInput: CreateOrderInput = {
    name: chance.name(),
  };

  const createEmployeeInput: CreateEmployeeInput = {
    name: chance.name(),
  };

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          {
            name: Order.name,
            schema: OrderSchema,
          },
          {
            name: Employee.name,
            schema: EmployeeSchema,
          },
        ]),
      ],
      providers: [OrderService, EmployeeService],
    }).compile();

    service = module.get<OrderService>(OrderService);
    employeeService = module.get<EmployeeService>(EmployeeService);
  });

  afterAll(async () => {
    if (module) {
      await module.close();
      await closeInMongodConnection();
    }
  });

  it('should create order', async () => {
    const order = await service.create(createOrderInput);
    expect(order.id).toBeDefined();
    expect(order.name).toBe(createOrderInput.name);
    expect(order.status).toBe(OrderStatus.OPEN.id);
    orderId = order.id;
  });

  it('should get a list of employees', async () => {
    const listOrderInput: ListOrderInput = {
      status: OrderStatus.OPEN.id,
    };
    const orders = await service.list(listOrderInput);
    expect(orders).toBeDefined();
    expect(orders.length).toBe(1);
    expect(Array.isArray(orders)).toBe(true);
    expect(orders[0].name).toBe(createOrderInput.name);
    expect(orders[0].status).toBe(OrderStatus.OPEN.id);
  });

  it('should get the employee by its own employeeId', async () => {
    const order = await service.getById(orderId);
    expect(order.id).toBe(orderId);
    expect(order.name).toBe(createOrderInput.name);
    expect(order.status).toBe(OrderStatus.OPEN.id);
  });

  it('should throw error when order state is skipped', async () => {
    const updateOrderInput: UpdateOrderInput = {
      _id: orderId,
      status: OrderStatus.DONE.id,
    };
    await expect(service.update(updateOrderInput)).rejects.toThrow(
      HttpException,
    );
  });

  it('should throw error when order state is not valid', async () => {
    const updateOrderInput: UpdateOrderInput = {
      _id: orderId,
      status: 'invalid state',
    };
    await expect(service.update(updateOrderInput)).rejects.toThrow(
      HttpException,
    );
  });

  it('should change state to progress and assign employee', async () => {
    await employeeService.create(createEmployeeInput);
    const updateOrderInput: UpdateOrderInput = {
      _id: orderId,
      status: OrderStatus.IN_PROGRESS.id,
    };
    const updatedOrder = await service.update(updateOrderInput);
    expect(updatedOrder.id).toBe(orderId);
    expect(updatedOrder.name).toBe(createOrderInput.name);
    expect(updatedOrder.status).toBe(updateOrderInput.status);
    expect(updatedOrder.employee).toBeDefined();
  });

  it('should change state to DONE and unassign employee', async () => {
    const updateOrderInput: UpdateOrderInput = {
      _id: orderId,
      status: OrderStatus.DONE.id,
    };
    const updatedOrder = await service.update(updateOrderInput);
    expect(updatedOrder.id).toBe(orderId);
    expect(updatedOrder.name).toBe(createOrderInput.name);
    expect(updatedOrder.status).toBe(updateOrderInput.status);
    expect(updatedOrder.employee).toBeNull();
  });
});
