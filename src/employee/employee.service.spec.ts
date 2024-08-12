import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeService } from './employee.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { UpdateEmployeeDto } from '../dto/update-employee.dto';

describe('EmployeeService', () => {
  let service: EmployeeService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeeService,
        PrismaService,
      ],
    }).compile();

    service = module.get<EmployeeService>(EmployeeService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createEmployee', () => {
    it('should create a new employee', async () => {
      const dto: CreateEmployeeDto = { name: 'John Doe', email: 'john@example.com', designationId: 1 };
      const result = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        designationId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Use spyOn to monitor the PrismaService methods
      const createSpy = jest.spyOn(prismaService.employee, 'create').mockResolvedValue(result);
      const findUniqueSpy = jest.spyOn(prismaService.employee, 'findUnique').mockResolvedValue(null);

      expect(await service.createEmployee(dto)).toEqual(result);
      expect(findUniqueSpy).toHaveBeenCalledWith({ where: { email: dto.email } });
      expect(createSpy).toHaveBeenCalledWith({ data: dto });
    });

    it('should return a message if employee already exists', async () => {
      const dto: CreateEmployeeDto = { name: 'John Doe', email: 'john@example.com', designationId: 1 };
      const result = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        designationId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };


      const findUniqueSpy = jest.spyOn(prismaService.employee, 'findUnique').mockResolvedValue(result);

      expect(await service.createEmployee(dto)).toEqual('The user already exists ');
      expect(findUniqueSpy).toHaveBeenCalledWith({ where: { email: dto.email } });
    });
  });

  describe('getEmployees', () => {
    it('should return a list of employees with their designations', async () => {
      const result = [
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          designationId: 1,
          designation: { id: 1, name: 'Developer' },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const findManySpy = jest.spyOn(prismaService.employee, 'findMany').mockResolvedValue(result);

      expect(await service.getEmployees()).toEqual(result);
      expect(findManySpy).toHaveBeenCalled();
    });
  });

  describe('getEmpData', () => {
    it('should return employee data by ID', async () => {
      const result = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        designationId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const findUniqueSpy = jest.spyOn(prismaService.employee, 'findUnique').mockResolvedValue(result);

      expect(await service.getEmpData(1)).toEqual(result);
      expect(findUniqueSpy).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException if employee not found', async () => {
      const findUniqueSpy = jest.spyOn(prismaService.employee, 'findUnique').mockResolvedValue(null);

      await expect(service.getEmpData(1)).rejects.toThrow(
        new NotFoundException('Employee data not found in this id:1'),
      );
      expect(findUniqueSpy).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe('deleteEmployee', () => {
    it('should delete an employee by ID', async () => {
      const result = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        designationId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const deleteSpy = jest.spyOn(prismaService.employee, 'delete').mockResolvedValue(result);

      expect(await service.deleteEmployee(1)).toEqual({ message: 'Employee successfully deleted' });
      expect(deleteSpy).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException if employee not found', async () => {
      const deleteSpy = jest.spyOn(prismaService.employee, 'delete').mockResolvedValue(null);

      await expect(service.deleteEmployee(1)).rejects.toThrow(
        new NotFoundException('Employee with id 1 not found'),
      );
      expect(deleteSpy).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe('updateEmployee', () => {
    it('should update an employee successfully', async () => {
      const dto: UpdateEmployeeDto = { name: 'Jane Doe', email: 'jane@example.com', designationId: 2 };
      const existingEmployee = { id: 1, name: 'John Doe', email: 'john@example.com', designationId: 1, createdAt: new Date(), updatedAt: new Date() };
      const updatedEmployee = { ...existingEmployee, ...dto };

      // Mock Prisma methods
      const findUniqueSpy = jest.spyOn(prismaService.employee, 'findUnique').mockResolvedValue(existingEmployee);
      const updateSpy = jest.spyOn(prismaService.employee, 'update').mockResolvedValue(updatedEmployee);
      const findDesignationSpy = jest.spyOn(prismaService.designation, 'findUnique').mockResolvedValue({ id: 2, name: 'Developer' });

      // Test
      expect(await service.updateEmployee(1, dto)).toEqual(updatedEmployee);
      expect(findUniqueSpy).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(findDesignationSpy).toHaveBeenCalledWith({ where: { id: 2 } });
      expect(updateSpy).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          name: dto.name,
          email: dto.email,
          designationId: dto.designationId,
        },
      });
    });

    it('should throw NotFoundException if employee does not exist', async () => {
      const dto: UpdateEmployeeDto = { name: 'Jane Doe', email: 'jane@example.com', designationId: 2 };

      // Mock Prisma methods
      jest.spyOn(prismaService.employee, 'findUnique').mockResolvedValue(null);

      // Test
      await expect(service.updateEmployee(1, dto)).rejects.toThrow(
        new NotFoundException('Employee with id 1 not found'),
      );
    });

    it('should throw NotFoundException if designation does not exist', async () => {
      const dto: UpdateEmployeeDto = { name: 'Jane Doe', email: 'jane@example.com', designationId: 2 };
      const existingEmployee = { id: 1, name: 'John Doe', email: 'john@example.com', designationId: 1, createdAt: new Date(), updatedAt: new Date() };

      // Mock Prisma methods
      jest.spyOn(prismaService.employee, 'findUnique').mockResolvedValue(existingEmployee);
      jest.spyOn(prismaService.designation, 'findUnique').mockResolvedValue(null);

      // Test
      await expect(service.updateEmployee(1, dto)).rejects.toThrow(
        new NotFoundException('Designation with id 2 not found'),
      );
    });
  });
});
