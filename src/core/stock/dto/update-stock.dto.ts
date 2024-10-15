import { PartialType } from '@nestjs/swagger';
import { CreateStockDto } from './create-stock.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateStockDto extends PartialType(CreateStockDto) {
  @ApiProperty()
  readonly name: string;

  @ApiProperty()
  readonly price: number;

  @ApiProperty()
  readonly stock: number;
}
