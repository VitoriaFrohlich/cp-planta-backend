import { Injectable } from '@nestjs/common';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';

@Injectable()
export class StockService {
  create(_createStockDto: CreateStockDto) {
    return 'This action adds a new stok';
  }

  findAll() {
    return 'This action returns all stok';
  }

  findOne(id: number) {
    return `This action returns a #${id} stok`;
  }

  update(id: number, _updateStockDto: UpdateStockDto) {
    return `This action updates a #${id} stok`;
  }

  remove(id: number) {
    return `This action removes a #${id} stok`;
  }
}
