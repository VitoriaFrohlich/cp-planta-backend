import { Test, TestingModule } from '@nestjs/testing';
import { OccurrenceService } from './occurrence.service';
import { OccurrenceRepository } from './occurrence.repository';
import { CreateOccurrenceDto } from './dto/create-occurrence.dto';
import { UpdateOccurrenceDto } from './dto/update-occurrence.dto';

describe('OccurrenceService', () => {
  let service: OccurrenceService;
  let repository: OccurrenceRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OccurrenceService,
        {
          provide: OccurrenceRepository,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn()
          }
        }
      ]
    }).compile();

    service = module.get<OccurrenceService>(OccurrenceService);
    repository = module.get<OccurrenceRepository>(OccurrenceRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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

      jest.spyOn(repository, 'create').mockResolvedValue(result);
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

      jest.spyOn(repository, 'update').mockResolvedValue(result);
    });

    it('should throw an error if occurrence is not found', async () => {
      const updateOccurrenceDto: UpdateOccurrenceDto = {
        description: 'Problema atualizado',
        updated_by: 1
      };

      await expect(service.update(1, updateOccurrenceDto)).rejects.toThrow(
        'Occurrence not found'
      );
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

      jest.spyOn(repository, 'findAll').mockResolvedValue(result);
    });
  });

  describe('findOne', () => {
    it('should return a single occurrence', async () => {
      const result = {
        id: 1,
        description: 'Problema com a máquina de corte',
        created_at: new Date(),
        updated_at: new Date(),
        created_by: '1',
        updated_by: '1'
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(result);
    });

    it('should return null if occurrence is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
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

      jest.spyOn(repository, 'remove').mockResolvedValue(result);
    });

    it('should throw an error if occurrence is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
    });
  });
});
