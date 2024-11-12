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
import { CreatePersonsDto } from './dto/create.persons.dto';
import { UpdatePersonsDto } from './dto/update.persons.dto';
import { ResponsePersonsDto } from './dto/response.persons.dto';

@Controller('persons')
export class PersonsController {
  constructor(private readonly personsService: PersonsService) {}

  @Post()
  async create(
    @Body() createPersonsDto: CreatePersonsDto
  ): Promise<ResponsePersonsDto> {
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
      created_at: person.created_at,
      updated_at: person.updated_at
    };

    return response;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePersonsDto: UpdatePersonsDto
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

    const updatedPerson = await this.personsService.update(
      idNumber,
      updatePersonsDto
    );

    return {
      id: updatedPerson.id,
      name: updatedPerson.name,
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
