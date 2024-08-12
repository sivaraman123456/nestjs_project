import { Body, Controller, Get, Post,Delete ,Patch,Param} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { UpdateEmployeeDto } from '../dto/update-employee.dto';
@ApiTags('Employees')
@Controller('employees')
export class EmployeeController {
  constructor(private employeeService: EmployeeService) {}

  @Post()
  async createEmployee(@Body() data: CreateEmployeeDto) {
    return this.employeeService.createEmployee(data);
  }

  @Get()
  async getEmployees() {
    return this.employeeService.getEmployees();
  }
  @Get(':id')
  async getDataById(@Param('id')id:number)
  {
    return this.employeeService.getEmpData(Number(id))
  }

  @Patch(':id')
  async updateEmployees(@Param('id')id:number,
  @Body() UpdateEmployeeDto: UpdateEmployeeDto ,) {
    return this.employeeService.updateEmployee(Number(id),UpdateEmployeeDto);
  }

  @Delete(':id')
async delEmployee(@Param('id')id:number)
{
return this.employeeService.deleteEmployee(Number(id))
}
}


