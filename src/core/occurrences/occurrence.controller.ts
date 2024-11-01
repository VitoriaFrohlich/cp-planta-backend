import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException
} from '@nestjs/common';
import { OccurrenceService } from './occurrence.service';
import { CreateOccurrenceDto } from './dto/create-occurrence.dto';
import { UpdateOccurrenceDto } from './dto/update-occurrence.dto';
import { CreateOccurrenceSchema } from './dto/occurrence.schema';

@Controller('occurrences')
export class OccurrenceController {
  constructor(private readonly occurrenceService: OccurrenceService) {}

  @Post()
  async create(@Body() createOccurrenceDto: CreateOccurrenceDto) {
    const errors = [];

    const descriptionValidation =
      CreateOccurrenceSchema.shape.description.safeParse(
        createOccurrenceDto.description
      );

    if (!descriptionValidation.success) {
      errors.push({
        field: 'description',
        message: descriptionValidation.error.errors[0].message
      });
    }

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const createdOccurence =
      await this.occurrenceService.create(createOccurrenceDto);

    return {
      id: createdOccurence.id,
      description: createdOccurence.description,
      created_at: createdOccurence.created_at,
      created_by: createdOccurence.created_by
    };
  }

  @Get()
  async findAll() {
    const occurrences = await this.occurrenceService.findAll();
    return occurrences.map(occurrence => ({
      id: occurrence.id,
      description: occurrence.description,
      created_at: occurrence.created_at,
      updated_at: occurrence.updated_at,
      created_by: occurrence.created_by,
      updated_by: occurrence.updated_by
    }));
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const idNumber = +id;

    if (isNaN(idNumber)) {
      throw new BadRequestException('ID Inválido');
    }

    const occurrence = await this.occurrenceService.findOne(idNumber);
    if (!occurrence) {
      throw new BadRequestException('Ocorrencia não encontrada');
    }
    return occurrence;
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
