import { Test, TestingModule } from '@nestjs/testing';
import { DesignationService } from './designation.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('DesignationService', () => {
  let service: DesignationService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DesignationService,
        {
          provide: PrismaService,
          useValue: {
            designation: {
              findFirst: jest.fn(),
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            employee: {
              count: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<DesignationService>(DesignationService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('createDesignation', () => {
    it('should create a new designation', async () => {
      const dto = { name: 'Software Engineer' };
      const result = { id: 1, ...dto };

      jest
        .spyOn(prismaService.designation, 'findFirst')
        .mockResolvedValue(null);
      jest.spyOn(prismaService.designation, 'create').mockResolvedValue(result);

      expect(await service.createDesignation(dto)).toEqual(result);
      expect(prismaService.designation.create).toHaveBeenCalledWith({
        data: dto,
      });
    });

    it('should return a message if designation already exists', async () => {
      const dto = { name: 'Software Engineer' };
      const result = { id: 1, name: 'Senior Software Engineer' };

      jest
        .spyOn(prismaService.designation, 'findFirst')
        .mockResolvedValue(result);

      expect(await service.createDesignation(dto)).toEqual(
        'This designation already exists',
      );
    });
  });

  describe('getDesignations', () => {
    it('should return an array of designations', async () => {
      const result = [{ id: 1, name: 'Software Engineer' }];

      jest
        .spyOn(prismaService.designation, 'findMany')
        .mockResolvedValue(result);

      expect(await service.getDesignations()).toEqual(result);
    });
  });

  describe('getDesById', () => {
    it('should return a designation by id', async () => {
      const result = { id: 1, name: 'Software Engineer' };

      jest
        .spyOn(prismaService.designation, 'findUnique')
        .mockResolvedValue(result);

      expect(await service.getDesById(1)).toEqual(result);
    });

    it('should throw NotFoundException if designation not found', async () => {
      jest
        .spyOn(prismaService.designation, 'findUnique')
        .mockResolvedValue(null);

      await expect(service.getDesById(1)).rejects.toThrow(
        new NotFoundException('Desgination not found in this id:1'),
      );
    });
  });

  describe('updateDes', () => {
    it('should update a designation', async () => {
      const id = 1;
      const dto = { name: 'Senior Software Engineer' };
      const result = { id, ...dto };

      jest
        .spyOn(prismaService.designation, 'findUnique')
        .mockResolvedValue(result);
      jest.spyOn(prismaService.designation, 'update').mockResolvedValue(result);

      expect(await service.updateDes(id, dto)).toEqual(result);
    });

    it('should throw NotFoundException if designation not found', async () => {
      const id = 1;
      const dto = { name: 'Senior Software Engineer' };

      jest
        .spyOn(prismaService.designation, 'findUnique')
        .mockResolvedValue(null);

      await expect(service.updateDes(id, dto)).rejects.toThrow(
        new NotFoundException(`Designation id${id} not found`),
      );
    });
  });

  describe('deleteDes', () => {
    it('should delete a designation', async () => {
      const id = 1;
      const result = { id, name: 'Software Engineer' };

      jest
        .spyOn(prismaService.designation, 'findUnique')
        .mockResolvedValue(result);
      jest.spyOn(prismaService.employee, 'count').mockResolvedValue(0);
      jest.spyOn(prismaService.designation, 'delete').mockResolvedValue(result);

      expect(await service.deleteDes(id)).toEqual(result);
    });

    it('should throw NotFoundException if designation not found', async () => {
      const id = 1;

      jest
        .spyOn(prismaService.designation, 'findUnique')
        .mockResolvedValue(null);

      await expect(service.deleteDes(id)).rejects.toThrow(
        new NotFoundException(`Designation with id ${id} not found`),
      );
    });

    it('should throw ConflictException if designation has related employees', async () => {
      const id = 1;
      const result = { id, name: 'Senior Software Engineer' };

      jest
        .spyOn(prismaService.designation, 'findUnique')
        .mockResolvedValue(result);
      jest.spyOn(prismaService.employee, 'count').mockResolvedValue(1);

      await expect(service.deleteDes(id)).rejects.toThrow(
        new ConflictException(
          `Designation with id ${id} cannot be deleted because it has related employees`,
        ),
      );
    });
  });
});
