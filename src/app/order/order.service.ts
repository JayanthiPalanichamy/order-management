import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateOrderInput } from './dto/create-order.input';
import { UpdateOrderInput } from './dto/update-order.input';
import { Order, OrderDocument } from './entities/order.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { ListOrderInput } from './dto/list-order.input';
import { OrderStatus } from './status/order-status';
import { EmployeeService } from '../employee/employee.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private readonly employeeService: EmployeeService,
  ) {}

  async create(createOrderInput: CreateOrderInput): Promise<Order> {
    const createdOrder = new this.orderModel({
      name: createOrderInput.name,
      lineItems: createOrderInput.lineItems,
    });
    return createdOrder.save();
  }

  async getById(_id: MongooseSchema.Types.ObjectId): Promise<Order> {
    return this.orderModel.findById(_id).populate('employee').exec();
  }

  async list(filter: ListOrderInput): Promise<Order[]> {
    return this.orderModel
      .find({ ...filter })
      .populate('employee')
      .exec();
  }

  async update(updateOrderInput: UpdateOrderInput): Promise<Order> {
    const order = await this.getById(updateOrderInput._id);
    if (order == null) {
      throw new HttpException('order not found', HttpStatus.NOT_FOUND);
    }
    const updatedOrder = await this.getUpdatedOrder(
      updateOrderInput,
      order.status,
      order.employee,
    );
    return this.orderModel
      .findByIdAndUpdate(updateOrderInput._id, updatedOrder, { new: true })
      .populate('employee')
      .exec();
  }

  async getUpdatedOrder(
    updateOrderInput: UpdateOrderInput,
    status: string,
    employeeId: MongooseSchema.Types.ObjectId,
  ) {
    if (updateOrderInput.status == null) {
      return updateOrderInput;
    }

    const newOrderStatus = OrderStatus[status].changeOrderStatus(
      updateOrderInput.status,
    );
    if (!newOrderStatus.assignEmployee()) {
      if (employeeId == null) {
        return { ...updateOrderInput };
      }
      await this.employeeService.unassignEmployee(employeeId);
      return {
        ...updateOrderInput,
        employee: null,
      };
    }
    const employee = await this.employeeService.assignFirstAvailableEmployee();
    return {
      ...updateOrderInput,
      employee: employee,
    };
  }
}
