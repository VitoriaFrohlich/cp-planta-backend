import { Controller } from '@nestjs/common';
import { OccurrenceService } from './occurrence.service';
@Controller('occurrences')
export class OccurrenceController {
  constructor(private readonly occurrenceService: OccurrenceService) {}
}
