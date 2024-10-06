import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete
} from '@nestjs/common';
import { OccurrenceService } from './occurrence.service';
import { CreateOccurrenceDto } from './dto/create-occurrence.dto';
import { UpdateOccurrenceDto } from './dto/update-occurrence.dto';

@Controller('occurences')
export class OccurrenceController {
  constructor(private readonly occurrenceService: OccurrenceService) {}

  @Post()
  create(@Body() createOccurrenceDto: CreateOccurrenceDto) {
    return this.occurrenceService.create(createOccurrenceDto);
  }

  @Get()
  findAll() {
    return this.occurrenceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.occurrenceService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOccurrenceDto: UpdateOccurrenceDto
  ) {
    return this.occurrenceService.update(+id, updateOccurrenceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.occurrenceService.remove(+id);
  }
}
