/* eslint-disable @typescript-eslint/no-explicit-any */
import { Test, TestingModule } from '@nestjs/testing';
import { StockService } from './stock.service';
import { StockRepository } from './stock.repository';
import { SettingsService } from '../../../src/settings/settings.service';
import { LoteService } from '../common/lote.utils';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateStockDto } from './dto/create.stock.dto';
import { Stock_Moviment } from '../common/enums';
import { UpdateStockDto } from './dto/update.stock.dto';

describe('StockService', () => {
  let stockService: StockService;
  let stockRepository: StockRepository;
  let settingsService: SettingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StockService,
        {
          provide: StockRepository,
          useValue: {
            findByDocumentNumber: jest.fn(),
            createStock: jest.fn(),
            createStockItems: jest.fn(),
            checkStock: jest.fn(),
            findAllStockItems: jest.fn(),
            findById: jest.fn(),
            getStockItems: jest.fn(),
            updateStock: jest.fn(),
            updateStockItems: jest.fn(),
            deleteStock: jest.fn()
          }
        },
        {
          provide: SettingsService,
          useValue: {
            get: jest.fn()
          }
        },
        {
          provide: LoteService,
          useValue: {
            generateLote: jest.fn()
          }
        }
      ]
    }).compile();

    stockService = module.get<StockService>(StockService);
    stockRepository = module.get<StockRepository>(StockRepository);
    settingsService = module.get<SettingsService>(SettingsService);
  });

  // Testes atualizados com base no objeto fornecido pelo backend
  describe('create', () => {
    it('should throw BadRequestException if document_number already exists', async () => {
      const createStockDto: CreateStockDto = {
        document_number: 'NFE123',
        document_date: new Date('2024-09-01T09:00:00.000Z'),
        stock_moviment: Stock_Moviment.INPUT,
        stock_items: []
      };

      const existingStock = {
        id: 1,
        document_number: 'NFE123',
        document_date: new Date('2024-09-01T09:00:00.000Z'),
        stock_moviment: Stock_Moviment.INPUT,
        document_type: 'nota entrada',
        is_balance: false,
        created_at: new Date('2024-11-10'),
        updated_at: new Date('2024-11-10'),
        created_by: null,
        updated_by: null,
        stock_items: []
      };

      jest
        .spyOn(stockRepository, 'findByDocumentNumber')
        .mockResolvedValueOnce(existingStock);

      await expect(stockService.create(createStockDto)).rejects.toThrow(
        BadRequestException
      );
    });
  });

  it('should create a stock document successfully', async () => {
    const createStockDto: CreateStockDto = {
      document_number: 'NFE123',
      document_date: new Date('2024-09-01T09:00:00.000Z'),
      stock_moviment: Stock_Moviment.INPUT,
      stock_items: []
    };

    jest
      .spyOn(stockRepository, 'findByDocumentNumber')
      .mockResolvedValueOnce(null);
    jest.spyOn(settingsService, 'get').mockResolvedValueOnce('false'); // enableNegativeStock
    jest.spyOn(stockRepository, 'createStock').mockResolvedValueOnce({
      id: 1,
      document_number: 'NFE123',
      document_date: new Date('2024-09-01T09:00:00.000Z'),
      stock_moviment: Stock_Moviment.INPUT,
      document_type: 'nota entrada',
      is_balance: false,
      created_at: new Date('2024-11-10'),
      updated_at: new Date('2024-11-10'),
      created_by: null,
      updated_by: null
    });
    jest
      .spyOn(stockRepository, 'createStockItems')
      .mockResolvedValueOnce({ id: 1 });

    const result = await stockService.create(createStockDto);

    expect(result).toHaveProperty('stockDocument');
    expect(result.stockDocument).toBeDefined();
    if (result.stockDocument) {
      expect(result.stockDocument.document_number).toBe('NFE123');
    }
  });

  describe('findAll', () => {
    it('should return all stock items', async () => {
      const stockItems = [
        {
          id: 1,
          document_number: 'NFE123',
          document_date: new Date('2024-09-01T09:00:00.000Z'),
          stock_moviment: Stock_Moviment.INPUT,
          document_type: 'nota entrada',
          is_balance: false,
          created_at: new Date('2024-11-10'),
          updated_at: new Date('2024-11-10'),
          created_by: null,
          updated_by: null
        },
        {
          id: 2,
          document_number: 'NFE124',
          document_date: new Date('2024-09-02T09:00:00.000Z'),
          stock_moviment: Stock_Moviment.INPUT,
          document_type: 'nota entrada',
          is_balance: false,
          created_at: new Date('2024-11-10'),
          updated_at: new Date('2024-11-10'),
          created_by: null,
          updated_by: null
        }
      ];

      jest
        .spyOn(stockRepository, 'findAllStockItems')
        .mockResolvedValueOnce(stockItems);

      const result = await stockService.findAll('created_at');

      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('created_at');
      expect(result[0]).toHaveProperty('updated_at');
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException if stock is not found', async () => {
      jest.spyOn(stockRepository, 'findById').mockResolvedValueOnce(null);

      await expect(stockService.findOne(999)).rejects.toThrow(
        NotFoundException
      );
    });

    it('should return the stock item if found', async () => {
      const stockItem = {
        id: 1,
        document_number: 'NFE123',
        document_date: new Date('2024-09-01T09:00:00.000Z'),
        stock_moviment: Stock_Moviment.INPUT,
        document_type: 'nota entrada',
        is_balance: false,
        created_at: new Date('2024-11-10'),
        updated_at: new Date('2024-11-10'),
        created_by: null,
        updated_by: null,
        stock_items: []
      };
      jest.spyOn(stockRepository, 'findById').mockResolvedValueOnce(stockItem);

      const result = await stockService.findOne(1);

      expect(result).toHaveProperty('id', 1);
      expect(result).toHaveProperty('document_number', 'NFE123');
    });
  });

  describe('update', () => {
    it('should update the stock and return updated items', async () => {
      const updateStockDto: UpdateStockDto = {
        updated_by: 'user1',
        stock_items: [{ id: 1, quantity: 20, unit_price: 150 }]
      };

      const updatedStock = {
        id: 1,
        document_number: 'NFE123',
        document_date: new Date('2024-09-01T09:00:00.000Z'),
        stock_moviment: Stock_Moviment.INPUT,
        document_type: 'nota entrada',
        is_balance: false,
        created_at: new Date('2024-11-10'),
        updated_at: new Date('2024-11-10'),
        created_by: null,
        updated_by: 'user1',
        stock_items: []
      };

      const updatedStockItems = [{ id: 1, quantity: 20, unit_price: 150 }];

      jest
        .spyOn(stockRepository, 'updateStock')
        .mockResolvedValueOnce(updatedStock);
      jest.spyOn(stockRepository, 'getStockItems').mockResolvedValueOnce([
        {
          id: 1,
          quantity: 10,
          unit_price: 100,
          created_at: new Date('2024-11-10'),
          updated_at: new Date('2024-11-10'),
          created_by: null,
          updated_by: null,
          stock_id: 1,
          sequence: 1,
          product_id: 1,
          lote: null,
          batchsid: null,
          expiration: null,
          total_price: 0,
          stock_location_id: 0,
          supplier: null,
          costumer: null,
          observation: null,
          photo: []
        }
      ]);
      jest
        .spyOn(stockRepository, 'updateStockItems')
        .mockResolvedValueOnce(updatedStockItems);

      const result = await stockService.update(1, updateStockDto);

      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('updatedItems');
      expect(result.updatedItems[0]).toHaveProperty('quantity', 20);
      expect(result.updatedItems[0]).toHaveProperty('unit_price', 150);

      // Verificar se os métodos do repositório foram chamados com os parâmetros corretos
      expect(stockRepository.updateStock).toHaveBeenCalledWith(
        1,
        updateStockDto
      );
      expect(stockRepository.updateStockItems).toHaveBeenCalledWith(1, {
        id: 1,
        quantity: 20,
        unit_price: 150
      });
    });
  });
});
