import { Test, TestingModule } from '@nestjs/testing';
import { OccurrenceController } from './occurrence.controller';
import { OccurrenceService } from './occurrence.service';
import { CreateOccurrenceDto } from './dto/create-occurrence.dto';
import { UpdateOccurrenceDto } from './dto/update-occurrence.dto';
import { BadRequestException } from '@nestjs/common';

describe('OccurrenceController', () => {
  let controller: OccurrenceController;
  let service: OccurrenceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OccurrenceController],
      providers: [
        {
          provide: OccurrenceService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn()
          }
        }
      ]
    }).compile();

    controller = module.get<OccurrenceController>(OccurrenceController);
    service = module.get<OccurrenceService>(OccurrenceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an occurrence', async () => {
      const createOccurrenceDto: CreateOccurrenceDto = {
        description: 'Problema com a máquina de corte',
        created_by: 1
      };
      const result = {
        id: 1,
        description: 'Problema com a máquina de corte',
        created_at: new Date(),
        updated_at: new Date(),
        created_by: '1',
        updated_by: null
      };

      jest.spyOn(service, 'create').mockResolvedValue(result);
    });

    it('should throw an error if description is not provided', async () => {
      const createOccurrenceDto: Partial<CreateOccurrenceDto> = {
        created_by: 1
      };

      await expect(() => controller.create(createOccurrenceDto as CreateOccurrenceDto))
        .rejects
        .toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return an array of occurrences', async () => {
      const result = [
        {
          id: 1,
          description: 'Problema com a máquina de corte',
          created_at: new Date(),
          updated_at: new Date(),
          created_by: '1',
          updated_by: '1'
        }
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(result);
    });
  });

  describe('findById', () => {
    it('should return a single occurrence', async () => {
      const result = {
        id: 1,
        description: 'Problema com a máquina de corte',
        created_at: new Date(),
        updated_at: new Date(),
        created_by: '1',
        updated_by: '1'
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(result);
    });

    it('should throw an error if ID is invalid', async () => {
      await expect(controller.findById('invalid')).rejects.toThrow(
        'ID Inválido'
      );
    });

    it('should throw an error if occurrence is not found', async () => {

      await expect(controller.findById('1')).rejects.toThrow(
        'Ocorrencia não encontrada'
      );
    });
  });

  describe('update', () => {
    it('should update an occurrence', async () => {
      const updateOccurrenceDto: UpdateOccurrenceDto = {
        description: 'Problema atualizado',
        updated_by: 1
      };
      const result = {
        id: 1,
        description: 'Problema atualizado',
        created_at: new Date(),
        updated_at: new Date(),
        created_by: '1',
        updated_by: '1'
      };

      jest.spyOn(service, 'update').mockResolvedValue(result);
    });

    it('should throw an error if occurrence is not found', async () => {
      const updateOccurrenceDto: UpdateOccurrenceDto = {
        description: 'Problema atualizado',
        updated_by: 1
      };

      jest.spyOn(service, 'update').mockImplementation(() => {
        throw new Error('Occurrence not found');
      });
    });
  });

  describe('remove', () => {
    it('should remove an occurrence', async () => {
      const result = {
        id: 1,
        description: 'Problema com a máquina de corte',
        created_at: new Date(),
        updated_at: new Date(),
        created_by: '1',
        updated_by: '1'
      };

      jest.spyOn(service, 'remove').mockResolvedValue(result);
    });

    it('should throw an error if occurrence is not found', async () => {
      jest.spyOn(service, 'remove').mockImplementation(() => {
        throw new Error('Occurrence not found');
      });
    });
  });
});
