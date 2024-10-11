import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  NotFoundException,
  BadRequestException
} from '@nestjs/common';
import { PersonsService } from './persons.service';
import { CreatePersonsDto } from './dto/create-persons.dto';
import { UpdatePersonsDto } from './dto/update-persons.dto';
import { CreatePersonsSchema, UpdatePersonsSchema } from './dto/person.schema';
import { ZodError } from 'zod';
import { ResponsePersonsDto } from './dto/response-persons.dto';

@Controller('persons')
export class PersonsController {
  constructor(private readonly personsService: PersonsService) {}

  @Post()
  async create(
    @Body() createPersonsDto: CreatePersonsDto
  ): Promise<ResponsePersonsDto> {
    const errors = [];

    const nameValidation = CreatePersonsSchema.shape.name.safeParse(
      createPersonsDto.name
    );
    if (!nameValidation.success) {
      errors.push({
        field: 'name',
        message: nameValidation.error.errors[0].message
      });
    }

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const matchedPersons = await this.personsService.matchPersonByData(
      createPersonsDto.name
    );

    if ((await matchedPersons).length > 0) {
      const existingPerson = matchedPersons[0];

      if (!existingPerson.active) {
        throw new BadRequestException(
          `Person already exists but is not active. Activate and update it: ${JSON.stringify(
            existingPerson
          )}`
        );
      }

      throw new BadRequestException(
        'Person already exists. Try update it instead'
      );
    }

    const createdPerson = await this.personsService.create(createPersonsDto);
    return {
      id: createdPerson.id,
      name: createdPerson.name,
      active: createdPerson.active,
      created_at: createdPerson.created_at,
      updated_at: createdPerson.updated_at
    };
  }

  @Get()
  async findAll(
    @Query('orderBy') orderBy: string = 'id'
  ): Promise<ResponsePersonsDto[]> {
    const validOrderFields = ['id', 'name'];

    if (!validOrderFields.includes(orderBy)) {
      throw new BadRequestException(`Invalid order field: ${orderBy}`);
    }

    const persons = await this.personsService.findAll(orderBy);
    return persons.map(person => ({
      id: person.id,
      name: person.name,
      active: person.active,
      created_at: person.created_at,
      updated_at: person.updated_at
    }));
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<ResponsePersonsDto> {
    const idNumber = +id;
    if (isNaN(idNumber)) {
      throw new BadRequestException('Invalid ID format');
    }

    const person = await this.personsService.findById(idNumber);

    const response: ResponsePersonsDto = {
      id: person.id,
      name: person.name,
      active: person.active,
      created_at: person.created_at,
      updated_at: person.updated_at
    };

    return response;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePersonsDto: UpdatePersonsDto,
    @Query() queryParams: Record<string, string>
  ): Promise<ResponsePersonsDto> {
    const idNumber = +id;
    if (isNaN(idNumber)) {
      throw new BadRequestException('Invalid ID format');
    }

    const existingPerson = await this.personsService.findById(idNumber);
    if (!existingPerson) {
      throw new NotFoundException(`Person with ID ${id} not found`);
    }

    if (!existingPerson.active) {
      throw new BadRequestException(`Person ID ${id} is not active`);
    }

    const allowedFields = Object.keys(UpdatePersonsSchema.shape);
    const fieldsToUpdate = Object.keys(queryParams);

    if (fieldsToUpdate.length === 0) {
      throw new BadRequestException('No fields provided to update');
    }

    const updateData: Partial<UpdatePersonsDto> = {};

    for (const field of fieldsToUpdate) {
      if (!allowedFields.includes(field)) {
        throw new BadRequestException(`Invalid field: ${field}`);
      }

      const value = queryParams[field];

      if (['person_id', 'group_id'].includes(field)) {
        const numericValue = parseInt(value, 10);
        if (isNaN(numericValue)) {
          throw new BadRequestException(
            `Invalid number format for field: ${field}`
          );
        }
        updateData[field] = numericValue;
      } else {
        if (value !== undefined) {
          updateData[field] = value;
        }
      }
    }

    const validation = UpdatePersonsSchema.safeParse(updateData);

    if (!validation.success) {
      const zodError = validation.error as ZodError;
      const firstError = zodError.errors[0];
      throw new BadRequestException(
        `${firstError.path[0]} is invalid: ${firstError.message}`
      );
    }

    const updatedPerson = await this.personsService.update(
      idNumber,
      updateData as UpdatePersonsDto
    );

    return {
      id: updatedPerson.id,
      name: updatedPerson.name,
      active: updatedPerson.active,
      created_at: updatedPerson.created_at,
      updated_at: updatedPerson.updated_at
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const idNumber = +id;

    if (isNaN(idNumber)) {
      throw new BadRequestException('Invalid ID format');
    }

    const existingPerson = await this.personsService.findById(idNumber);
    if (!existingPerson) {
      throw new NotFoundException(`Person with ID ${idNumber} not found`);
    }

    try {
      await this.personsService.remove(idNumber);

      return { message: `Person with ID ${idNumber} deleted successfully` };
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }

  @Post('activate/:id')
  async activate(@Param('id') id: string) {
    const idNumber = +id;
    if (isNaN(idNumber)) {
      throw new BadRequestException('Invalid ID format');
    }

    await this.personsService.reactivatePerson(idNumber);

    return { message: `Person ID ${id} activated successfully` };
  }
}
