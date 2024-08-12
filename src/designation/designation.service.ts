import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDesignationDto } from '../dto/create-designation.dto';
import { UpdateDesignationDto } from '../dto/update-designation.dto';
@Injectable()
export class DesignationService {
  constructor(private prisma: PrismaService) {}

  async createDesignation(data: CreateDesignationDto){
    const exists = await this.prisma.designation.findFirst({
      where: { name: data.name },
    });
    if (exists) {
      return `This designation already exists`;
    }
    return this.prisma.designation.create({
      data,
    });
  }

  async getDesignations(){
    return this.prisma.designation.findMany();
  }

  async getDesById(id: number){
    const des_data = await this.prisma.designation.findUnique({
      where: { id },
    });
    if (!des_data) {
      throw new NotFoundException(`Desgination not found in this id:${id}`);
    }
    return des_data;
  }

  async updateDes(id: number, data: UpdateDesignationDto){
    const des = await this.prisma.designation.findUnique({
      where: { id },
    });

    if (!des) {
      throw new NotFoundException(`Designation id${id} not found`);
    }
    const update_des = await this.prisma.designation.update({
      where: { id },
      data: {
        name: data.name,
      },
    });

    return update_des;
  }

  async deleteDes(id: number){
    // Check if the designation exists
    const designation = await this.prisma.designation.findUnique({
      where: { id },
    });
    if (!designation) {
      throw new NotFoundException(`Designation with id ${id} not found`);
    }

    // Check if the designation has related employees
    const hasEmployees = await this.prisma.employee.count({
      where: { designationId: id },
    });

    if (hasEmployees > 0) {
      throw new ConflictException(
        `Designation with id ${id} cannot be deleted because it has related employees`,
      );
    }

    // Proceed to delete the designation
    return this.prisma.designation.delete({
      where: { id },
    });
  }
}
