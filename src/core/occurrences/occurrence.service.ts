import { Injectable } from '@nestjs/common';
import { CreateOccurrenceDto } from './dto/create-occurrence.dto';
import { UpdateOccurrenceDto } from './dto/update-occurrence.dto';

@Injectable()
export class OccurrenceService {
  create(_CreateOccurrenceDto: CreateOccurrenceDto) {
    return {};
  }

  findAll() {
    return {};
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
