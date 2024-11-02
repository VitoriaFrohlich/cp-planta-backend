import { Injectable } from '@nestjs/common';
import { OccurrenceRepository } from './occurrence.repository';

@Injectable()
export class OccurrenceService {
  constructor(private readonly occurrenceRepository: OccurrenceRepository) {}
}
