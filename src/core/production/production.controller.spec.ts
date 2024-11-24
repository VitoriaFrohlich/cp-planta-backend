import { Test, TestingModule } from '@nestjs/testing';
import { jest } from '@jest/globals';
import { ProductionController } from './production.controller';
import { ProductionService } from './production.service';
import { CreateProductionDto } from './dto/create.production.dto';
import { Production_Status } from '.././common/enums';

describe('ProductionController', () => {
  let controller: ProductionController;
  let service: ProductionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductionController],
      providers: [ProductionService]
    }).compile();

    controller = module.get<ProductionController>(ProductionController);
    service = module.get<ProductionService>(ProductionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('create', () => {
    const validProductionDto: CreateProductionDto = {
      number: 123,
      description: 'Sample Production',
      production_date: '2024-01-01',
      Production_Status: Production_Status.OPEN,
      final_product_id: 101,
      production_quantity_estimated: 100,
      production_quantity_real: 98,
      production_quantity_loss: 2,
      created_at: new Date('2024-01-01'),
      updated_at: new Date('2024-01-01'),
      created_by: '',
      updated_by: '',

      //Production_Status: Production_Status.OPEN,
      production_items: [
        {
          id: 1,
          production_order_id: 1,
          sequence: 1,
          raw_product_id: 1,
          raw_product_initial_quantity: 100,
          raw_product_used_quantity: 98,
          created_at: new Date('2024-01-01'),
          updated_at: new Date('2024-01-01'),
          created_by: 'user1',
          updated_by: 'user1',
          used_batchs: [
            {
              stock_item_id: 1,
              batch: 'sku',
              quantity: 200
            }
          ]
        }
      ]
    };

    it('should create a new production successfully', async () => {
      //const result = { id: 1, ...validProductionDto };
      const result = {
        production: {
          id: 1,
          description: validProductionDto.description,
          production_date: validProductionDto.production_date,
          created_at: 'date',
          updated_at: 'date',
          Production_Status: validProductionDto.Production_Status,
          items: validProductionDto.production_items.map(item => ({
            ...item,
            raw_product_initial_quantity:
              item.raw_product_initial_quantity || 0,
            created_at: 'date',
            updated_at: 'date',
            created_by: 'user1',
            updated_by: 'user1'
          }))
        }
      };

      jest.spyOn(service, 'create').mockResolvedValue(result);

      expect(await controller.create(validProductionDto)).toEqual(result);
    });

    it('should throw an error for missing required fields', async () => {
      const invalidDto = { ...validProductionDto, description: '' };

      jest.spyOn(service, 'create').mockImplementation(() => {
        throw new Error('Validation failed: description is required');
      });

      await expect(controller.create(invalidDto)).rejects.toThrow(
        'Validation failed: description is required'
      );
    });

    it('should throw an error for invalid production date format', async () => {
      const invalidDto = {
        ...validProductionDto,
        production_date: 'invalid-date'
      };

      jest.spyOn(service, 'create').mockImplementation(() => {
        throw new Error('Invalid production date format');
      });

      await expect(controller.create(invalidDto)).rejects.toThrow(
        'Invalid production date format'
      );
    });

    it('should throw an error for empty production items', async () => {
      const invalidDto = { ...validProductionDto, production_items: [] };

      jest.spyOn(service, 'create').mockImplementation(() => {
        throw new Error('At least one production item is required');
      });

      await expect(controller.create(invalidDto)).rejects.toThrow(
        'At least one production item is required'
      );
    });
  });
});
