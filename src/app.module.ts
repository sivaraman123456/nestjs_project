import { Module } from '@nestjs/common';
import { EmployeeModule } from './employee/employee.module';
import { DesignationModule } from './designation/designation.module';
import { PrismaModule } from './prisma/prisma.module';
@Module({
  imports: [EmployeeModule, DesignationModule, PrismaModule],
})
export class AppModule {}
