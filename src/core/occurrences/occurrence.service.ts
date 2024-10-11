import { Injectable } from '@nestjs/common';
import { CreateOccurrenceDto } from './dto/create-occurrence.dto';
import { UpdateOccurrenceDto } from './dto/update-occurrence.dto';
import { OccurrenceRepository } from './occurrence.repository';

@Injectable()
export class OccurrenceService {
  constructor(private readonly occurrenceRepository: OccurrenceRepository) {}

  async create(createOccurrenceDto: CreateOccurrenceDto) {
    const newOccurrence = {
      ...createOccurrenceDto,
      created_at: new Date(),
      created_by: 1, // Replace with actual user
      updated_at: null,
      updated_by: null
    };
    return this.occurrenceRepository.create(newOccurrence);
  }

  async update(id: number, updateOccurrenceDto: UpdateOccurrenceDto) {
    const occurrence = await this.occurrenceRepository.findOne(id);
    if (!occurrence) {
      throw new Error('Occurrence not found');
    }

    // Whitelist of allowed fields
    const allowedFields = ['description', 'updated_by'];
    const updateData = {};

    // Filter the updateOccurrenceDto to only include allowed fields
    for (const key of Object.keys(updateOccurrenceDto)) {
      if (allowedFields.includes(key)) {
        updateData[key] = updateOccurrenceDto[key];
      }
    }

    updateData['updated_at'] = new Date();

    return this.occurrenceRepository.update(id, updateData);
  }

  async findAll() {
    return this.occurrenceRepository.findAll();
  }

  async findOne(id: number) {
    return this.occurrenceRepository.findOne(id);
  }

  // async remove(id: number) {
  //   const occurrence = await this.occurrenceRepository.findOne(id);
  //   if (!occurrence) {
  //     throw new Error('Occurrence not found');
  //   }
  //   return this.occurrenceRepository.remove(id);
  // }
}
