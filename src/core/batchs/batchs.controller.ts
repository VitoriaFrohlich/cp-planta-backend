import { Controller } from '@nestjs/common';
import { BatchsService } from './batchs.service';

@Controller('batchs')
export class BatchsController {
  constructor(private readonly batchsService: BatchsService) {}
}
