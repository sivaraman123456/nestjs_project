import { Injectable ,NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { UpdateEmployeeDto } from 'src/dto/update-employee.dto';
@Injectable()
export class EmployeeService {
  constructor(private prisma: PrismaService) {}

  async createEmployee(data: CreateEmployeeDto) {
    const exists= await this.prisma.employee.findUnique({
      where:{email:data.email}
    })
    if(exists)
    {
    return `The user already exists `
    }
    
    return this.prisma.employee.create({
      data,
    });
  }

async getEmployees() {
    return this.prisma.employee.findMany({
      include: { designation: true },
    });
  }
async getEmpData(id:number)
{
const Emp_data=await this.prisma.employee.findUnique({
  where:{id}
})

if(!Emp_data)
{
  throw new NotFoundException(`Employee data not found in this id:${id}`)
}
return Emp_data;
}

  async deleteEmployee(id: number) {
    const employee = await this.prisma.employee.delete({
      where: { id },
    });
    if (!employee) {
      throw new NotFoundException(`Employee with id ${id} not found`);
    }
    return { message: 'Employee successfully deleted' };
  }


  async updateEmployee(id: number, data: UpdateEmployeeDto) {
    // Check if the employee exists
    const employee = await this.prisma.employee.findUnique({
      where: { id },
    });
    if (!employee) {
      throw new NotFoundException(`Employee with id ${id} not found`);
    }

    // Check if the designation exists if designationId is provided
    if (data.designationId) {
      const designation = await this.prisma.designation.findUnique({
        where: { id: data.designationId },
      });
      if (!designation) {
        throw new NotFoundException(`Designation with id ${data.designationId} not found`);
      }
    }

    // Perform the update
    const updatedEmployee = await this.prisma.employee.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
        designationId: data.designationId,
      },
    });

    return updatedEmployee;
  }
}
