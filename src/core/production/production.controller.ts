import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  BadRequestException,
  NotFoundException,
  HttpStatus
} from '@nestjs/common';
import { ProductionService } from './production.service';
import { CreateProductionDto } from './dto/create.production.dto';
import { UpdateProductionDto } from './dto/update.production.dto';
import { ApiQuery } from '@nestjs/swagger';
import { ShortResponseProductionDto } from './dto/response.production.dto';

@Controller('orders')
export class ProductionController {
  constructor(private readonly productionService: ProductionService) {}

  @Post()
  create(@Body() createProductionDto: CreateProductionDto) {
    return this.productionService.create(createProductionDto);
  }

  @Get()
  @ApiQuery({
    name: 'orderBy',
    required: false,
    description:
      'Field to order by. Valid fields: id, description, production_date, Production_Status, created_by, updated_by',
    enum: [
      'id',
      'number',
      'description',
      'production_date',
      'production_line',
      'Production_Status',
      'created_by',
      'updated_by'
    ]
  })
  async findAll(@Query('orderBy') orderBy: string = 'id') {
    const validOrderFields = [
      'id',
      'number',
      'description',
      'production_date',
      'production_line',
      'Production_Status',
      'created_by',
      'updated_by'
    ];
    if (!validOrderFields.includes(orderBy)) {
      throw new BadRequestException(`Invalid order field: ${orderBy}`);
    }
    return this.productionService.findAll(orderBy);
  }
  @Get('short-list')
  async shortFindAll(): Promise<ShortResponseProductionDto[]> {
    const orderBy = 'id';
    const orders = await this.productionService.findAll(orderBy);

    return orders.map(order => {
      return {
        id: order.id,
        description: order.description,
        Production_Status: order.Production_Status as string
      };
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const idNumber = +id;
    if (isNaN(idNumber)) {
      throw new BadRequestException('ID is a number');
    }
    return this.productionService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductionDto: UpdateProductionDto
  ) {
    const maintenanceMode = true;

    if (maintenanceMode) {
      return {
        statusCode: HttpStatus.SERVICE_UNAVAILABLE,
        success: false,
        message:
          'Este endpoint está em manutenção no momento. Por favor, tente novamente mais tarde.',
        data: null
      };
    }

    const idNumber = +id;
    if (isNaN(idNumber)) {
      throw new BadRequestException('Formato de ID inválido');
    }
    const existingProduction = await this.productionService.findOne(idNumber);
    if (!existingProduction) {
      throw new NotFoundException(
        `Ordem de produção com ID ${idNumber} não encontrada`
      );
    }
    return this.productionService.update(idNumber, updateProductionDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const idNumber = +id;
    if (isNaN(idNumber)) {
      throw new BadRequestException('Invalid ID format');
    }
    await this.productionService.remove(idNumber);
    return { message: `Production order with ID ${idNumber} removed` };
  }
}
