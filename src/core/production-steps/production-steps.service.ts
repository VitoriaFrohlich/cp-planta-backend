import { Injectable } from '@nestjs/common';
import { ProductionStepsRepository } from './production-steps.repository';

@Injectable()
export class ProductionStepsService {
  constructor(
    private readonly productionStepsRepository: ProductionStepsRepository
  ) {}
}
