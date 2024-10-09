import { Test, TestingModule } from '@nestjs/testing';
import { OccurrenceController } from './occurrence.controller';
import { OccurrenceService } from './occurrence.service';

describe('OccurenceController', () => {
  let controller: OccurrenceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OccurrenceController],
      providers: [OccurrenceService]
    }).compile();

    controller = module.get<OccurrenceController>(OccurrenceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
