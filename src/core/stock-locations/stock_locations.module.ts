import { Module } from '@nestjs/common';
import { StockLocationsController } from './stock_locations.controller';
import { StockLocationsService } from './stock_locations.service';
import { PrismaModule } from 'src/database/prisma/prisma.module';
import { StockLocationsRepository } from './stock-locations.repository';

@Module({
  imports: [PrismaModule],
  controllers: [StockLocationsController],
  providers: [StockLocationsService, StockLocationsRepository]
})
export class StockLocationsModule {}
