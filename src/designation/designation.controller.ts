import {
  Body,
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Patch,
} from '@nestjs/common';
import { DesignationService } from './designation.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateDesignationDto } from '../dto/create-designation.dto';
import { UpdateDesignationDto } from '../dto/update-designation.dto';
@ApiTags('Designations')
@Controller('designations')
export class DesignationController {
  constructor(private designationService: DesignationService) {}

  @Post()
  async createDesignation(@Body() data: CreateDesignationDto) {
    return this.designationService.createDesignation(data);
  }

  @Get()
  async getDesignations() {
    return this.designationService.getDesignations();
  }

  @Get(':id')
  async getDesignationsById(@Param('id') id: number) {
    return this.designationService.getDesById(Number(id));
  }
  @Patch(':id')
  async updateDesgination(
    @Param('id') id: number,
    @Body() UpdateDesignationDto: UpdateDesignationDto,
  ) {
    return this.designationService.updateDes(Number(id), UpdateDesignationDto);
  }
  @Delete(':id')
  async delDesignation(@Param('id') id: number) {
    return this.designationService.deleteDes(Number(id));
  }
}
