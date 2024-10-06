import { Injectable } from '@nestjs/common';
import { CreateOccurrenceDto } from './dto/create-occurrence.dto';
import { UpdateOccurrenceDto } from './dto/update-occurrence.dto';

@Injectable()
export class OccurrenceService {
  create(_createProductionDto: CreateOccurrenceDto) {
    return 'This action adds a new production';
  }

  findAll() {
    return 'This action returns all production';
  }

  findOne(id: number) {
    return `This action returns a #${id} production`;
  }

  update(id: number, _UpdateOccurrenceDto: UpdateOccurrenceDto) {
    return `This action updates a #${id} production`;
  }

  remove(id: number) {
    return `This action removes a #${id} production`;
  }
}
