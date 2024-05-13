import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateEmployeeInput } from './dto/create-employee.input';
import {
  Availabilty,
  Employee,
  EmployeeDocument,
} from './entities/employee.entity';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ListEmployeeInput } from './dto/list-employee.input';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectModel(Employee.name) private employeeModel: Model<EmployeeDocument>,
  ) {}
  async create(createEmployeeInput: CreateEmployeeInput): Promise<Employee> {
    const createdEmployee = new this.employeeModel(createEmployeeInput);
    return createdEmployee.save();
  }

  async getById(_id: MongooseSchema.Types.ObjectId): Promise<Employee> {
    return this.employeeModel.findById(_id).exec();
  }

  async list(filter: ListEmployeeInput): Promise<Employee[]> {
    return this.employeeModel.find({ ...filter }).exec();
  }

  async assignFirstAvailableEmployee(): Promise<Employee> {
    const employee = await this.employeeModel
      .findOne({ availablity: Availabilty.FREE })
      .exec();
    if (employee == null) {
      throw new HttpException(
        'No available employee found',
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.employeeModel.findByIdAndUpdate(
      employee._id,
      {
        availablity: Availabilty.OCCUPIED,
      },
      { new: true },
    );
  }

  async unassignEmployee(
    _id: MongooseSchema.Types.ObjectId,
  ): Promise<Employee> {
    return await this.employeeModel.findByIdAndUpdate(
      _id,
      {
        availablity: Availabilty.FREE,
      },
      { new: true },
    );
  }
}
