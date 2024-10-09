import { Test, TestingModule } from '@nestjs/testing';
import { OccurrenceService } from './occurrence.service';

describe('OccurrenceService', () => {
  let service: OccurrenceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OccurrenceService]
    }).compile();

    service = module.get<OccurrenceService>(OccurrenceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
