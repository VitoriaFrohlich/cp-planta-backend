import { Injectable } from '@nestjs/common';
import { ProductionProgressRepository } from './production-progress.repository';

@Injectable()
export class ProductionProgressService {
  constructor(
    private readonly productionProgressRepository: ProductionProgressRepository
  ) {}
}
