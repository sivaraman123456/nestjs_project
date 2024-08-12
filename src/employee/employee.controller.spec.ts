import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { UpdateEmployeeDto } from '../dto/update-employee.dto';

describe('EmployeeController',()=>{

    let employeeController:EmployeeController;
    let employeeService:EmployeeService;

    beforeEach(async()=>{
    const module:TestingModule=await Test.createTestingModule({
controllers:[EmployeeController],
providers:[
    {
        provide:EmployeeService,
        useValue:{
            createEmployee:  jest.fn(),
            getEmployees: jest.fn(),
            getEmpData:jest.fn(),
            updateEmployee:jest.fn(),
            deleteEmployee:jest.fn(),
        }
    }
]
    }).compile();
    employeeController=module.get<EmployeeController>(EmployeeController);
    employeeService=module.get<EmployeeService>(EmployeeService);
    })

describe('createEmployee',()=>{
    it('should return a messae if the user already exists',async()=>{
        const userDto:CreateEmployeeDto={name:'siva',email:'siva@gmail.com',designationId:1};
        const result = {
            id: 1,
            name: 'John Doe',
            email: 'john.doe@example.com',
            designationId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
        jest.spyOn(employeeService,'createEmployee').mockResolvedValue(result);
        expect(await employeeController.createEmployee(userDto)).toBe(result);
        expect(employeeService.createEmployee).toHaveBeenCalledWith(userDto);
    })
})
 describe('getEmployees', () => {
    it('should return an array of employees', async () => {
        const result = [
            {
              id: 1,
              name: 'John Doe',
              email: 'john.doe@example.com',
              designationId: 1,
              designation: {
                id: 1,
                name: 'Developer',
              },
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ];
      
      jest.spyOn(employeeService, 'getEmployees').mockResolvedValue(result);
      expect(await employeeController.getEmployees()).toEqual(result);
      expect(employeeService.getEmployees).toHaveBeenCalled();
    });
  });

describe('getDataById', () => {
    it('should return an array of employees', async () => {
        const id = 1;
        const result = {
          id,
          name: 'John Doe',
          email: 'john.doe@example.com',
          designationId: 1,
          designation: {
            id: 1,
            name: 'Developer',
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      
      jest.spyOn(employeeService, 'getEmpData').mockResolvedValue(result);
      expect(await employeeController.getDataById(id)).toEqual(result);
      expect(employeeService.getEmpData).toHaveBeenCalledWith(id);
    });
  });

  describe('updateEmployees', () => {
    it('should update an employee', async () => {
      const id = 1;
      const updateEmployeeDto: UpdateEmployeeDto = {
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        designationId: 2,
      };
      const result = {
        id,
        name: 'John Doe',
        email: 'john.doe@example.com',
        designationId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(employeeService, 'updateEmployee').mockResolvedValue(result);

      expect(await employeeController.updateEmployees(id, updateEmployeeDto)).toEqual(result);
      expect(employeeService.updateEmployee).toHaveBeenCalledWith(id, updateEmployeeDto);
    });
  });

describe('delEmployee', () => {
    it('should delete the employee details by ID and return a confirmation message', async () => {
      const id = 1;
      const result = { message: `Employee with ID ${id} deleted successfully` };

      jest.spyOn(employeeService, 'deleteEmployee').mockResolvedValue(result);

      expect(await employeeController.delEmployee(id)).toEqual(result);
      expect(employeeService.deleteEmployee).toHaveBeenCalledWith(id);
    });
  });
})
