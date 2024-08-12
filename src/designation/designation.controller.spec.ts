import { Test, TestingModule } from '@nestjs/testing';
import { DesignationController } from './designation.controller';
import { DesignationService } from './designation.service';
import { CreateDesignationDto } from '../dto/create-designation.dto';
import { UpdateDesignationDto } from '../dto/update-designation.dto';

describe('DesignationController', () => {
  let controller: DesignationController;
  let service: DesignationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DesignationController],
      providers: [
        {
          provide: DesignationService,
          useValue: {
            createDesignation: jest.fn(),
            getDesignations: jest.fn(),
            getDesById: jest.fn(),
            updateDes: jest.fn(),
            deleteDes: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<DesignationController>(DesignationController);
    service = module.get<DesignationService>(DesignationService);
  });

  describe('createDesignation', () => {
    it('should create a new designation', async () => {
      const dto: CreateDesignationDto = { name: 'Software Engineer' };
      const result = { id: 1, ...dto };

      jest.spyOn(service, 'createDesignation').mockResolvedValue(result);

      expect(await controller.createDesignation(dto)).toEqual(result);
      expect(service.createDesignation).toHaveBeenCalledWith(dto);
    });
  });

  describe('getDesignations', () => {
    it('should return an array of designations', async () => {
      const result = [
        { id: 1, name: 'Software Engineer' },
        { id: 2, name: 'Data Scientist' },
      ];

      jest.spyOn(service, 'getDesignations').mockResolvedValue(result);

      expect(await controller.getDesignations()).toEqual(result);
      expect(service.getDesignations).toHaveBeenCalled();
    });
  });

  describe('getDesignationsById', () => {
    it('should return a designation by id', async () => {
        const id=1;
      const result = { id, name: 'Software Engineer' };

      jest.spyOn(service, 'getDesById').mockResolvedValue(result);

      expect(await controller.getDesignationsById(id)).toEqual(result);
      expect(service.getDesById).toHaveBeenCalledWith(id);
    });

  });

  describe('updateDesgination', () => {
    it('should update a designation', async () => {
      const dto: UpdateDesignationDto = { name: 'Senior Software Engineer' };
      const result = { id: 1, name: 'Senior Software Engineer' };

      jest.spyOn(service, 'updateDes').mockResolvedValue(result);

      expect(await controller.updateDesgination(1, dto)).toEqual(result);
      expect(service.updateDes).toHaveBeenCalledWith(1, dto);
    });

 
  });

  describe('delDesignation', () => {
    it('should delete a designation', async () => {
      const result = { id: 1, name: 'Senior Software Engineer' };

      jest.spyOn(service, 'deleteDes').mockResolvedValue(result);

      expect(await controller.delDesignation(1)).toEqual(result);
      expect(service.deleteDes).toHaveBeenCalledWith(1);
    });


  });
});
