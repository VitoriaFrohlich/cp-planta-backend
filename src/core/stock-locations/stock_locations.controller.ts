import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query
} from '@nestjs/common';
import { CreateStockLocationDto } from './dto/create.stock-locations.dto';
import { StockLocationsService } from './stock_locations.service';
import { UpdateStockLocationDto } from './dto/update.stock-locations.dto';
import { ResponseStockLocationDto } from './dto/response.stock-locations';

@Controller('stock-locations')
export class StockLocationsController {
  constructor(private readonly stockLocationService: StockLocationsService) {}

  @Post()
  async create(
    @Body() createStockLocationDto: CreateStockLocationDto
  ): Promise<ResponseStockLocationDto> {
    const matchedStockLocations =
      await this.stockLocationService.matchStockLocationByData(
        createStockLocationDto.description
      );

    if ((await matchedStockLocations).length > 0) {
      const existingStockLocation = matchedStockLocations[0];

      if (!existingStockLocation.active) {
        throw new BadRequestException(
          `Stock Location already exists but is not active. Activate and update it: ${JSON.stringify(
            existingStockLocation
          )}`
        );
      }

      throw new BadRequestException(
        'Stock Location already exists. Try update it instead'
      );
    }
    const createdStockLocation = await this.stockLocationService.create(
      createStockLocationDto
    );
    return {
      id: createdStockLocation.id,
      description: createdStockLocation.description,
      created_at: createdStockLocation.created_at,
      updated_at: createdStockLocation.updated_at
    };
  }

  @Get()
  async findAll(
    @Query('orderBy') orderBy: string = 'id'
  ): Promise<ResponseStockLocationDto[]> {
    const validOrderFields = ['id', 'description'];

    if (!validOrderFields.includes(orderBy)) {
      throw new BadRequestException(`Invalid order field: ${orderBy}`);
    }

    const stockLocation = await this.stockLocationService.findAll(orderBy);

    return stockLocation.map(stockLocation => ({
      id: stockLocation.id,
      description: stockLocation.description,
      created_at: stockLocation.created_at,
      updated_at: stockLocation.updated_at
    }));
  }

  @Get(':id')
  findById(@Param('id') id: string): Promise<ResponseStockLocationDto> {
    const idNumber = +id;
    if (isNaN(idNumber)) {
      throw new BadRequestException('Invalid ID format');
    }
    const stockLocation = this.stockLocationService.findById(idNumber);

    return stockLocation.then(stockLocation => ({
      id: stockLocation.id,
      description: stockLocation.description,
      created_at: stockLocation.created_at,
      updated_at: stockLocation.updated_at
    }));
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateStockLocationDto: UpdateStockLocationDto
  ): Promise<ResponseStockLocationDto> {
    const idNumber = +id;
    if (isNaN(idNumber)) {
      throw new BadRequestException('Invalid ID format');
    }

    const existingStockLocation =
      await this.stockLocationService.findById(idNumber);
    if (!existingStockLocation) {
      throw new NotFoundException(
        `Stock Location with ID ${idNumber} not found`
      );
    }

    if (!existingStockLocation.active) {
      throw new BadRequestException(
        `Stock Location ID ${idNumber} is not active`
      );
    }

    const updatedStockLocation = await this.stockLocationService.update(
      idNumber,
      updateStockLocationDto
    );

    return {
      id: updatedStockLocation.id,
      description: updatedStockLocation.description,
      created_at: updatedStockLocation.created_at,
      updated_at: updatedStockLocation.updated_at
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const idNumber = +id;
    if (isNaN(idNumber)) {
      throw new BadRequestException('Invalid ID format');
    }
    await this.stockLocationService.remove(idNumber);

    return {
      message: `Stock Location with ID ${idNumber} deleted successfully`
    };
  }

  @Post('activate/:id')
  async activate(@Param('id') id: string) {
    const idNumber = +id;
    if (isNaN(idNumber)) {
      throw new BadRequestException('Invalid ID format');
    }
    await this.stockLocationService.reactivate(idNumber);

    return {
      message: `Stock Location with ID ${idNumber} activated successfully`
    };
  }
}
