import { Injectable } from '@nestjs/common';
import { OccurrenceRepository } from './occurrences.repository';

@Injectable()
export class OccurrenceService {
  constructor(private readonly occurrenceRepository: OccurrenceRepository) {}
}
