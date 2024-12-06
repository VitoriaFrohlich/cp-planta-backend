import { Test, TestingModule } from '@nestjs/testing';
import { ProductionService } from './production.service';
import { ProductionRepository } from './production.repository';
import { SessionService } from '../common/sessionService';
import { SettingsService } from '../../settings/settings.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Production_Status } from '../common/enums';
import { CreateProductionDto } from './dto/create.production.dto';
import { JsonValue } from '@prisma/client/runtime/library';

describe('ProductionService', () => {
  let service: ProductionService;
  let productionRepository: jest.Mocked<ProductionRepository>;
  let settingsService: jest.Mocked<SettingsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductionService,
        {
          provide: ProductionRepository,
          useValue: {
            findProductDescriptionById: jest.fn(),
            findCompositionById: jest.fn(),
            findCompositionItemsById: jest.fn(),
            findStockItemById: jest.fn(),
            createOrder: jest.fn(),
            createOrderItem: jest.fn(),
            getOrderItems: jest.fn()
          }
        },
        {
          provide: SessionService,
          useValue: {
            getCurrentUser: jest.fn()
          }
        },
        {
          provide: SettingsService,
          useValue: {
            get: jest.fn(),
            incrementOrderNumber: jest.fn()
          }
        }
      ]
    }).compile();

    service = module.get<ProductionService>(ProductionService);
    productionRepository = module.get(ProductionRepository);
    settingsService = module.get(SettingsService);
  });

  describe('create', () => {
    it('should successfully create a new production order', async () => {
      const createProductionDto: CreateProductionDto = {
        number: 101,
        description: 'Ordem Test Product - 101',
        production_date: '2024-01-01',
        Production_Status: Production_Status.OPEN,
        final_product_id: 101,
        production_quantity_estimated: 100,
        production_quantity_real: 98,
        production_quantity_loss: 2,
        created_at: new Date(),
        updated_at: new Date(),
        created_by: '',
        updated_by: '',
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

      const productDescription = 'Test Product';
      const composition = {
        id: 1,
        created_at: new Date('2024-01-01'),
        updated_at: new Date('2024-01-01'),
        created_by: 'user1',
        updated_by: 'user1',
        description: 'Test Composition',
        final_product: 101,
        production_steps: {}
      };

      const compositionItems = [
        {
          id: 1,
          sequence: 1,
          created_at: new Date('2024-01-01'),
          updated_at: new Date('2024-01-01'),
          created_by: 'user1',
          updated_by: 'user1',
          quantity: 2,
          composition_id: 1,
          raw_product: 1
        },
        {
          id: 2,
          sequence: 2,
          created_at: new Date('2024-01-01'),
          updated_at: new Date('2024-01-01'),
          created_by: 'user1',
          updated_by: 'user1',
          quantity: 3,
          composition_id: 1,
          raw_product: 2
        }
      ];

      productionRepository.findProductDescriptionById.mockResolvedValue(
        productDescription
      );
      productionRepository.findCompositionById.mockResolvedValue(composition);
      productionRepository.findCompositionItemsById.mockResolvedValue(
        compositionItems
      );
      productionRepository.findStockItemById.mockResolvedValue({
        id: 1,
        sequence: 1,
        created_at: new Date('2024-01-01'),
        updated_at: new Date('2024-01-01'),
        created_by: 'user1',
        updated_by: 'user1',
        stock_id: 1,
        product_id: 1,
        quantity: 100,
        observation: null,
        unit_price: 10.0,
        total_price: 1000.0,
        batch: 'batch-001',
        batch_expiration: new Date('2025-01-01'),
        sku: 'ABC123',
        images: [],
        supplier: 123,
        costumer: null,
        stock_location_id: 101
      });

      settingsService.get.mockResolvedValue('100');
      productionRepository.createOrder.mockResolvedValue({
        id: 1,
        number: 101,
        description: 'Ordem Test Product - 101',
        production_date: new Date('2024-01-01'),
        production_line: 'Line 1',
        Production_Status: Production_Status.OPEN,
        final_product_id: 101,
        production_quantity_estimated: 100,
        production_quantity_real: 98,
        production_quantity_loss: 2,
        created_at: new Date(),
        updated_at: new Date(),
        created_by: '',
        updated_by: ''
      });

      productionRepository.createOrderItem.mockResolvedValue(null);
      productionRepository.getOrderItems.mockResolvedValue([]);

      const result = await service.create(createProductionDto);

      expect(result.production).toHaveProperty('id');
      expect(result.production.description).toBe('Ordem Test Product - 101');
      expect(result.production.Production_Status).toBe('OPEN');
      expect(result.production.items).toHaveLength(0);
    });

    it('should throw NotFoundException if composition is not found', async () => {
      const createProductionDto: CreateProductionDto = {
        number: 123,
        description: 'Sample Production',
        production_date: '2024-12-01',
        final_product_id: 1,
        production_quantity_estimated: 100,
        production_quantity_real: 98,
        production_quantity_loss: 2,
        created_at: new Date('2024-12-01'),
        updated_at: new Date('2024-12-01'),
        created_by: 'user1',
        updated_by: 'user1',
        Production_Status: Production_Status.OPEN,
        production_items: [
          {
            id: 1,
            production_order_id: 1,
            sequence: 1,
            raw_product_id: 1,
            raw_product_initial_quantity: 100,
            raw_product_used_quantity: 50,
            created_at: new Date('2024-12-01'),
            updated_at: new Date('2024-12-01'),
            created_by: 'user1',
            updated_by: 'user1',
            used_batchs: [
              {
                stock_item_id: 1,
                batch: 'batch-001',
                quantity: 50
              }
            ]
          }
        ]
      };
      productionRepository.findCompositionById.mockResolvedValueOnce(
        null as unknown as {
          id: number;
          created_at: Date;
          updated_at: Date;
          created_by: string | null;
          updated_by: string | null;
          description: string;
          final_product: number;
          production_steps: JsonValue;
        }
      );

      await expect(service.create(createProductionDto)).rejects.toThrow(
        new NotFoundException('Composition with ID 1 not found')
      );
    });

    it('should throw BadRequestException if production item is invalid', async () => {
      const createProductionDto: CreateProductionDto = {
        number: 123,
        description: 'Sample Production',
        production_date: '2024-12-01',
        final_product_id: 1,
        production_quantity_estimated: 100,
        production_quantity_real: 98,
        production_quantity_loss: 2,
        created_at: new Date('2024-12-01'),
        updated_at: new Date('2024-12-01'),
        created_by: 'user1',
        updated_by: 'user1',
        Production_Status: Production_Status.OPEN,
        production_items: [
          {
            id: 1,
            production_order_id: 1,
            sequence: 1,
            raw_product_id: 1,
            raw_product_initial_quantity: 100,
            raw_product_used_quantity: 50,
            created_at: new Date('2024-12-01'),
            updated_at: new Date('2024-12-01'),
            created_by: 'user1',
            updated_by: 'user1',
            used_batchs: [
              {
                stock_item_id: 1,
                batch: 'batch-001',
                quantity: 50
              }
            ]
          }
        ]
      };

      productionRepository.findProductDescriptionById.mockResolvedValue(
        'Test Product'
      );
      productionRepository.findCompositionById.mockResolvedValue({
        id: 1,
        created_at: new Date('2024-01-01'),
        updated_at: new Date('2024-01-01'),
        created_by: 'user1',
        updated_by: 'user1',
        description: 'Test Composition',
        final_product: 101,
        production_steps: {}
      });
      productionRepository.findCompositionItemsById.mockResolvedValue([
        {
          id: 1,
          sequence: 1,
          created_at: new Date('2024-01-01'),
          updated_at: new Date('2024-01-01'),
          created_by: 'user1',
          updated_by: 'user1',
          quantity: 2,
          composition_id: 1,
          raw_product: 1
        }
      ]);
      settingsService.get.mockResolvedValue('100');
      productionRepository.createOrder.mockResolvedValue({
        id: 1,
        number: 123,
        description: 'Order 101',
        production_date: new Date('2024-12-01'),
        production_line: 'Line 1',
        Production_Status: Production_Status.OPEN,
        final_product_id: 1,
        production_quantity_estimated: 100,
        production_quantity_real: 98,
        production_quantity_loss: 2,
        created_at: new Date(),
        updated_at: new Date(),
        created_by: 'user1',
        updated_by: 'user1'
      });

      productionRepository.findCompositionItemsById.mockResolvedValue([]);

      await expect(service.create(createProductionDto)).rejects.toThrow(
        new BadRequestException('Produto 1 não está presente na composição.')
      );
    });
  });
});
