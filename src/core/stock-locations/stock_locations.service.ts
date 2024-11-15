import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { StockLocationsRepository } from './stock-locations.repository';
import { CreateStockLocationDto } from './dto/create.stock-locations.dto';
import { stock_location } from '@prisma/client';
import { format } from 'date-fns';
import { UpdateStockLocationDto } from './dto/update.stock-locations.dto';
import { SessionService } from '../common/sessionService';
@Injectable()
export class StockLocationsService {
  constructor(
    private readonly sessionService: SessionService,
    private readonly stockLocationRepository: StockLocationsRepository
  ) {}

  async create(createStockLocationDto: CreateStockLocationDto) {
    const currentUser = this.sessionService.getCurrentUser();

    const createStockLocation = {
      ...createStockLocationDto,
      created_at: new Date(),
      updated_at: new Date(),
      created_by: currentUser,
      updated_by: currentUser
    };
    const createdStockLocation =
      await this.stockLocationRepository.create(createStockLocation);

    return this.formatStockLocationDate(createdStockLocation);
  }

  async findAll(orderBy: string): Promise<
    (Omit<stock_location, 'created_at' | 'updated_at'> & {
      created_at: string;
      updated_at: string;
    })[]
  > {
    const findedStockLocations =
      await this.stockLocationRepository.findAll(orderBy);
    return findedStockLocations.map(stockLocation =>
      this.formatStockLocationDate(stockLocation)
    );
  }

  async findById(id: number) {
    const stockLocation = await this.isValid(id);
    return this.formatStockLocationDate(stockLocation);
  }

  private formatStockLocationDate(stockLocation: stock_location): Omit<
    stock_location,
    'created_at' | 'updated_at'
  > & {
    created_at: string;
    updated_at: string;
  } {
    return {
      ...stockLocation,
      created_at: format(
        new Date(stockLocation.created_at),
        'dd/MM/yyyy HH:mm:ss'
      ),
      updated_at: format(
        new Date(stockLocation.updated_at),
        'dd/MM/yyyy HH:mm:ss'
      )
    };
  }

  async isValid(id: number) {
    const stockLocation = await this.stockLocationRepository.findById(id);

    if (!stockLocation) {
      throw new NotFoundException(`Stock Location with ID ${id} not found`);
    } else if (!stockLocation.active) {
      throw new BadRequestException(
        `Stock Location with ID ${id} is not active`
      );
    }
    return stockLocation;
  }

  async reactivate(id: number) {
    const stockLocation = await this.stockLocationRepository.findById(id);

    if (!stockLocation) {
      throw new NotFoundException(`Stock Location with ID ${id} not found`);
    }
    if (stockLocation.active) {
      throw new BadRequestException(
        `Stock Location with ID ${id} is already active`
      );
    }
    return this.stockLocationRepository.reactivate(id);
  }

  async matchStockLocationByData(description: string) {
    const matchedStockLocation =
      await this.stockLocationRepository.matchStockLocationByData(description);

    return matchedStockLocation.map(stockLocation =>
      this.formatStockLocationDate(stockLocation)
    );
  }

  async update(id: number, updateStockLocationDto: UpdateStockLocationDto) {
    const currentUser = this.sessionService.getCurrentUser();
    if (updateStockLocationDto.description) {
      const existingStockLocation = await this.matchStockLocationByData(
        updateStockLocationDto.description
      );
      if (
        existingStockLocation.length > 0 &&
        existingStockLocation[0].id !== id
      ) {
        throw new BadRequestException(
          `This description "${updateStockLocationDto.description}" already exists in other Stock Location.`
        );
      }
    }
    const updatedStockLocationDto = {
      ...updateStockLocationDto,
      updated_at: new Date(),
      active: updateStockLocationDto.active,
      updated_by: currentUser
    };

    const updatedStockLocation = await this.stockLocationRepository.update(
      id,
      updatedStockLocationDto
    );

    return this.formatStockLocationDate(updatedStockLocation);
  }

  async remove(id: number) {
    await this.isValid(id);
    return this.stockLocationRepository.delete(id);
  }
}
