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
import { CreateStockLocationDto } from './dto/create-stock-locations.dto';
import {
  CreateStockLocationSchema,
  UpdateStockLocationSchema
} from './dto/stock-location.schema';
import { StockLocationsService } from './stock_locations.service';
import { UpdateStockLocationDto } from './dto/update-stock-locations.dto';
import { ZodError } from 'zod';
import { ResponseStockLocationDto } from './dto/response-stock-locations';

@Controller('stock-locations')
export class StockLocationsController {
  constructor(private readonly stockLocationService: StockLocationsService) {}

  @Post()
  async create(
    @Body() createStockLocationDto: CreateStockLocationDto
  ): Promise<ResponseStockLocationDto> {
    const errors = [];

    const descriptionValidation =
      CreateStockLocationSchema.shape.description.safeParse(
        createStockLocationDto.description
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
      active: createdStockLocation.active,
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
      active: stockLocation.active,
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
      active: stockLocation.active,
      created_at: stockLocation.created_at,
      updated_at: stockLocation.updated_at
    }));
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() UpdateStockLocationDto: UpdateStockLocationDto,
    @Query() queryParams: Record<string, string>
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

    const allowedFields = Object.keys(UpdateStockLocationSchema.shape);
    const fieldsToUpdate = Object.keys(queryParams);

    if (fieldsToUpdate.length === 0) {
      throw new BadRequestException('No fields provided to update');
    }

    const updateData: Partial<UpdateStockLocationDto> = {};

    for (const field of fieldsToUpdate) {
      if (!allowedFields.includes(field)) {
        throw new BadRequestException(`Invalid field to update: ${field}`);
      }

      const value = queryParams[field];

      if (['id', 'otherField_id'].includes(field)) {
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

    const validation = UpdateStockLocationSchema.safeParse(updateData);

    if (!validation.success) {
      const zodError = validation.error as ZodError;
      const firstError = zodError.errors[0];
      throw new BadRequestException(
        `${firstError.path[0]} is invalid: ${firstError.message}`
      );
    }

    const updatedStockLocation = await this.stockLocationService.update(
      idNumber,
      updateData as UpdateStockLocationDto
    );

    return {
      id: updatedStockLocation.id,
      description: updatedStockLocation.description,
      active: updatedStockLocation.active,
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
