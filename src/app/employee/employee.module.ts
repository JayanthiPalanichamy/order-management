import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmployeeResolver } from './employee.resolver';
import { Employee, EmployeeSchema } from './entities/employee.entity';
import { EmployeeService } from './employee.service';

@Module({
  providers: [EmployeeResolver, EmployeeService],
  imports: [
    MongooseModule.forFeature([
      { name: Employee.name, schema: EmployeeSchema },
    ]),
  ],
  exports: [EmployeeService],
})
export class EmployeeModule {}
