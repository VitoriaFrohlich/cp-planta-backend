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
import { StockService } from './stock.service';
import { CreateStockDto } from './dto/create.stock.dto';
import { UpdateStockDto } from './dto/update.stock.dto';
import { ApiQuery } from '@nestjs/swagger';
import { Stock_Moviment } from '../common/enums';
import { ResponseBatchDto } from './dto/response.stock.dto';

@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post()
  create(@Body() createStockDto: CreateStockDto) {
    return this.stockService.create(createStockDto);
  }

  @Get()
  @ApiQuery({
    name: 'orderBy',
    required: false,
    description:
      'Field to order by. Valid fields: id, product_id, lote, quantity, stock_id, sequence, created_at, updated_at',
    enum: [
      'id',
      'product_id',
      'lote',
      'quantity',
      'stock_id',
      'sequence',
      'created_at',
      'updated_at'
    ]
  })
  async findAll(@Query('orderBy') orderBy: string = 'id') {
    const validOrderFields = [
      'id',
      'product_id',
      'lote',
      'quantity',
      'stock_id',
      'sequence',
      'created_at',
      'updated_at'
    ];

    if (!validOrderFields.includes(orderBy)) {
      throw new BadRequestException(`Invalid order field: ${orderBy}`);
    }

    const stock = await this.stockService.findAll(orderBy);
    return stock;
  }

  @Get('batchs')
  async getAllProductLots(
    @Query('orderBy') orderBy: 'asc' | 'desc' = 'asc',
    @Query('origin') origin?: 'RAW_MATERIAL' | 'MADE'
  ) {
    const result = await this.stockService.getAllProductLots(orderBy, origin);
    return result;
  }

  @Get('gen-batchs')
  async generateBatchs(
    @Query('moviment') moviment: string
  ): Promise<ResponseBatchDto> {
    const stockMoviment = moviment.toUpperCase() as Stock_Moviment;

    if (
      ![Stock_Moviment.INPUT, Stock_Moviment.OUTPUT].includes(stockMoviment)
    ) {
      throw new BadRequestException(
        'Movimentação inválida. Use INPUT ou OUTPUT.'
      );
    }

    const batch = await this.stockService.getLote(stockMoviment);

    return {
      lote: batch[0],
      expiration: batch[1]
    } as ResponseBatchDto;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const idNumber = +id;
    if (isNaN(idNumber)) {
      throw new BadRequestException('Invalid ID format');
    }
    return this.stockService.findOne(idNumber);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStockDto: UpdateStockDto) {
    const idNumber = +id;
    if (isNaN(idNumber)) {
      throw new BadRequestException('Invalid ID format');
    }
    return this.stockService.update(idNumber, updateStockDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const idNumber = +id;
    if (isNaN(idNumber)) {
      throw new BadRequestException('Invalid ID format');
    }

    await this.stockService.remove(idNumber);
    return { message: `Stock ID ${idNumber} permanently removed successfully` };
  }
}
