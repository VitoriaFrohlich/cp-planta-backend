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
import {
  CreateCompositionsSchema,
  UpdateCompositionsSchema
} from './dto/compositions.schema';
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

    const validationResult = CreateCompositionsSchema.safeParse(
      createCompositionsDto
    );

    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));

      throw new BadRequestException({
        message: 'Validation errors',
        errors
      });
    }
    const created = await this.compositionsService.create(
      createCompositionsDto
    );

    return {
      id: created.compositionsDocument.id,
      final_product: created.compositionsDocument.product_id,
      description: created.compositionsDocument.description,
      production_steps: created.compositionsDocument.production_steps,
      created_at: created.compositionsDocument.created_at,
      composition_items: created.compositionsDocument.items.map(item => ({
        id: item.id,
        sequence: item.sequence,
        raw_product: item.raw_product,
        quantity: item.quantity,
        created_at: item.created_at,
        compositions_id: item.compositions_id,
        created_by: item.created_by
      }))
    };
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

    const compositions = await this.compositionsService.findAll(orderBy);

    return compositions.map(composition => ({
      id: composition.id,
      final_product: composition.final_product,
      description: composition.description,
      production_steps: Array.isArray(composition.production_steps)
        ? composition.production_steps.map(step => String(step))
        : [],
      created_at: composition.created_at,
      updated_at: composition.updated_at,
      created_by: composition.created_by,
      updated_by: composition.updated_by,
      composition_items: (composition.composition_items || []).map(item => ({
        id: item.id,
        compositions_id: item.compositions_id,
        sequence: item.sequence,
        raw_product: item.raw_product,
        quantity: item.quantity,
        created_at: item.created_at,
        updated_at: item.updated_at,
        created_by: item.created_by,
        updated_by: item.updated_by
      }))
    }));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const idNumber = +id;
    if (isNaN(idNumber)) {
      throw new BadRequestException('Invalid ID format');
    }
    const composition = await this.compositionsService.findOne(idNumber);

    return {
      id: composition.id,
      final_product: composition.final_product,
      description: composition.description,
      production_steps: Array.isArray(composition.production_steps)
        ? composition.production_steps.map(step => String(step))
        : [],
      created_at: composition.created_at,
      updated_at: composition.updated_at,
      created_by: composition.created_by,
      updated_by: composition.updated_by,
      composition_items: (composition.composition_items || []).map(item => ({
        id: item.id,
        compositions_id: item.compositions_id,
        sequence: item.sequence,
        raw_product: item.raw_product,
        quantity: item.quantity,
        created_at: item.created_at,
        updated_at: item.updated_at,
        created_by: item.created_by,
        updated_by: item.updated_by
      }))
    };
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

    const validationResult = UpdateCompositionsSchema.safeParse(
      updateCompositionsDto
    );

    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));

      throw new BadRequestException({
        message: 'Validation errors',
        errors
      });
    }

    const updated = await this.compositionsService.update(
      idNumber,
      updateCompositionsDto
    );

    return {
      id: updated.compositionsDocument.id,
      final_product: updated.compositionsDocument.product_id,
      description: updated.compositionsDocument.description,
      production_steps: updated.compositionsDocument.production_steps,
      updated_at: updated.compositionsDocument.updated_at,
      composition_items: updated.compositionsDocument.items.map(item => ({
        id: item.id,
        sequence: item.sequence,
        raw_product: item.raw_product,
        quantity: item.quantity,
        created_at: item.created_at,
        compositions_id: item.compositions_id,
        created_by: item.created_by
      }))
    };
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
}
