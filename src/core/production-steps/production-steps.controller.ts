import { Controller } from '@nestjs/common';
import { ProductionStepsService } from './production-steps.service';

@Controller('steps')
export class ProductionStepsController {
  constructor(private readonly categoriesService: ProductionStepsService) {}
}
