import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { Schema as MongooseSchema } from 'mongoose';
import { EmployeeService } from './employee.service';
import { Employee } from './entities/employee.entity';
import { CreateEmployeeInput } from './dto/create-employee.input';
import { ListEmployeeInput } from './dto/list-employee.input';

@Resolver(() => Employee)
export class EmployeeResolver {
  constructor(private readonly employeeService: EmployeeService) {}

  @Mutation(() => Employee)
  async createEmployee(
    @Args('createEmployeeInput') createEmployeeInput: CreateEmployeeInput,
  ): Promise<Employee> {
    return this.employeeService.create(createEmployeeInput);
  }

  @Query(() => Employee, { name: 'employee' })
  async employee(
    @Args('_id', { type: () => String }) _id: MongooseSchema.Types.ObjectId,
  ): Promise<Employee> {
    return this.employeeService.getById(_id);
  }

  @Query(() => [Employee], { name: 'employees' })
  async employees(
    @Args('filters', { nullable: true }) filters?: ListEmployeeInput,
  ): Promise<Employee[]> {
    return this.employeeService.list(filters);
  }
}
