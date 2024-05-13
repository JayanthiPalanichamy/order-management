import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeResolver } from './employee.resolver';
import { EmployeeService } from './employee.service';
import { Schema } from 'mongoose';
import { Chance } from 'chance';
import { CreateEmployeeInput } from './dto/create-employee.input';
import { Availabilty } from './entities/employee.entity';
import { ListEmployeeInput } from './dto/list-employee.input';

describe('EmployeeResolver', () => {
  let resolver: EmployeeResolver;
  const chance = new Chance();
  const employeeId = new Schema.Types.ObjectId('');
  const createEmployeeInput: CreateEmployeeInput = {
    name: chance.name(),
  };

  const mockService = {
    create: jest.fn(() => {
      return {
        _id: employeeId,
        ...createEmployeeInput,
        availabilty: Availabilty.FREE,
      };
    }),
    getById: jest.fn(() => {
      return {
        _id: employeeId,
        ...createEmployeeInput,
        availabilty: Availabilty.FREE,
      };
    }),
    list: jest.fn(() => {
      return [
        {
          _id: employeeId,
          ...createEmployeeInput,
          availabilty: Availabilty.FREE,
        },
      ];
    }),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeeResolver,
        {
          provide: EmployeeService,
          useValue: mockService,
        },
      ],
    }).compile();

    resolver = module.get<EmployeeResolver>(EmployeeResolver);
  });

  it('should be able to create an employee', async () => {
    const employee = await resolver.createEmployee(createEmployeeInput);
    expect(employee._id).toBeDefined();
    expect(employee._id).toBe(employeeId);
    expect(employee.name).toBe(createEmployeeInput.name);
  });

  it('should be able to list all employee', async () => {
    const listEmployeeInput: ListEmployeeInput = {
      availablity: Availabilty.FREE,
    };
    const employees = await resolver.employees(listEmployeeInput);
    expect(employees).toBeDefined();
    expect(Array.isArray(employees)).toBe(true);
    expect(employees[0]._id).toBe(employeeId);
  });

  it('should be able to find one employee by id', async () => {
    const employee = await resolver.employee(employeeId);
    expect(employee).toBeDefined();
    expect(employee._id).toBe(employeeId);
  });
});
