import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  BadRequestException,
  Delete
} from '@nestjs/common';
import { CompositionsService } from './compositions.service';
import { CreateCompositionsDto } from './dto/create.compositions.dto';
import { UpdateCompositionsDto } from './dto/update.compositions.dto';
import { ApiQuery } from '@nestjs/swagger';
import { ResponseCompositionsDto } from './dto/response.compositions.dto';

@Controller('compositions')
export class CompositionsController {
  constructor(private readonly compositionsService: CompositionsService) {}

  @Post()
  async create(
    @Body() createCompositionsDto: CreateCompositionsDto
  ): Promise<ResponseCompositionsDto> {
    if (!Array.isArray(createCompositionsDto.composition_items)) {
      throw new BadRequestException('Items must be an array');
    }

    return await this.compositionsService.create(createCompositionsDto);
  }

  @Get()
  @ApiQuery({
    name: 'orderBy',
    required: false,
    description:
      'Field to order by. Valid fields: id, product_id, created_at, updated_at',
    enum: ['id', 'product_id', 'created_at', 'updated_at']
  })
  async findAll(
    @Query('orderBy') orderBy: string = 'id'
  ): Promise<ResponseCompositionsDto[]> {
    const validOrderFields = ['id', 'product_id', 'created_at', 'updated_at'];

    if (!validOrderFields.includes(orderBy)) {
      throw new BadRequestException(`Invalid order field: ${orderBy}`);
    }

    return await this.compositionsService.findAll(orderBy);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const idNumber = +id;
    if (isNaN(idNumber)) {
      throw new BadRequestException('Invalid ID format');
    }
    return await this.compositionsService.findOne(idNumber);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCompositionsDto: UpdateCompositionsDto
  ) {
    const idNumber = +id;
    if (isNaN(idNumber)) {
      throw new BadRequestException('Invalid ID format');
    }

    if (!Array.isArray(updateCompositionsDto.composition_items)) {
      throw new BadRequestException('Items must be an array');
    }

    return await this.compositionsService.update(
      idNumber,
      updateCompositionsDto
    );
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const idNumber = +id;
    if (isNaN(idNumber)) {
      throw new BadRequestException('Invalid ID format');
    }

    await this.compositionsService.delete(idNumber);
    return {
      message: `Compositions ID ${idNumber} permanently removed successfully`
    };
  }

  @Get('steps-by-product/:id')
  async getByProduct(@Param('id') id: string) {
    const idNumber = +id;
    if (isNaN(idNumber)) {
      throw new BadRequestException('Invalid ID format');
    }
    return await this.compositionsService.getByProduct(idNumber);
  }
}
