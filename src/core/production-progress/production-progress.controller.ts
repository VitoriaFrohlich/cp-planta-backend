import { Controller } from '@nestjs/common';
import { ProductionProgressService } from './production-progress.service';

@Controller('progress')
export class ProductionProgressController {
  constructor(
    private readonly productionProgressService: ProductionProgressService
  ) {}
}
