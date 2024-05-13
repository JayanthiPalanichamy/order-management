import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeService } from './employee.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../common/helpers/mongoose.helper';
import {
  Availabilty,
  Employee,
  EmployeeSchema,
} from './entities/employee.entity';
import { CreateEmployeeInput } from './dto/create-employee.input';
import { Chance } from 'chance';
import { ListEmployeeInput } from './dto/list-employee.input';
import { Schema } from 'mongoose';
import { HttpException } from '@nestjs/common';

describe('EmployeeService', () => {
  let service: EmployeeService;
  let module: TestingModule;
  const chance = new Chance();
  let employeeId = new Schema.Types.ObjectId('');
  const createEmployeeInput: CreateEmployeeInput = {
    name: chance.name(),
  };

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          {
            name: Employee.name,
            schema: EmployeeSchema,
          },
        ]),
      ],
      providers: [EmployeeService],
    }).compile();

    service = module.get<EmployeeService>(EmployeeService);
  });

  afterAll(async () => {
    if (module) {
      await module.close();
      await closeInMongodConnection();
    }
  });

  it('should create employee', async () => {
    const employee = await service.create(createEmployeeInput);
    expect(employee.id).toBeDefined();
    expect(employee.name).toBe(createEmployeeInput.name);
    expect(employee.availablity).toBe(Availabilty.FREE);
    employeeId = employee.id;
  });

  it('should get a list of employees', async () => {
    const listEmployeeInput: ListEmployeeInput = {
      availablity: Availabilty.FREE,
    };
    const employees = await service.list(listEmployeeInput);
    expect(employees).toBeDefined();
    expect(employees.length).toBe(1);
    expect(Array.isArray(employees)).toBe(true);
    expect(employees[0].name).toBe(createEmployeeInput.name);
    expect(employees[0].availablity).toBe(Availabilty.FREE);
  });

  it('should get the employee by its own employeeId', async () => {
    const employee = await service.getById(employeeId);
    expect(employee.id).toBe(employeeId);
    expect(employee.name).toBe(createEmployeeInput.name);
    expect(employee.availablity).toBe(Availabilty.FREE);
  });

  it('should get first assignable employee and set the availablity status to occupied', async () => {
    const freeEmployee = await service.assignFirstAvailableEmployee();
    expect(freeEmployee.id).toBe(employeeId);
    expect(freeEmployee.name).toBe(createEmployeeInput.name);
    expect(freeEmployee.availablity).toBe(Availabilty.OCCUPIED);
  });

  it('should throw error when no employee is found', async () => {
    await expect(service.assignFirstAvailableEmployee()).rejects.toThrow(
      HttpException,
    );
  });

  it('should unassignable employee and set the availablity status to Free', async () => {
    const freeEmployee = await service.unassignEmployee(employeeId);
    expect(freeEmployee.id).toBe(employeeId);
    expect(freeEmployee.name).toBe(createEmployeeInput.name);
    expect(freeEmployee.availablity).toBe(Availabilty.FREE);
  });
});
