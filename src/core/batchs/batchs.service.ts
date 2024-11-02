import { Injectable } from '@nestjs/common';
import { BatchsRepository } from './batchs.repository';

@Injectable()
export class BatchsService {
  constructor(private readonly BatchsRepository: BatchsRepository) {}
}
