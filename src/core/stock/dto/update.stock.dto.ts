import { PartialType } from '@nestjs/swagger';
import { CreateStockItemsDto } from './create.stock.dto';
import { Stock_Moviment } from 'src/core/common/enums';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

export class UpdateStockDto {
  @ApiHideProperty()
  updated_at?: Date;

  @ApiHideProperty()
  updated_by?: number;

  @ApiHideProperty()
  readonly document_date?: Date;

  @ApiHideProperty()
  readonly document_number?: string;

  @ApiHideProperty()
  readonly stock_moviment?: Stock_Moviment;

  @ApiHideProperty()
  readonly is_balance?: boolean;

  @ApiProperty({
    description: 'Stock items',
    type: 'object',
    required: true
  })
  stock_items?: UpdateStockItemsDto[];
}
export class UpdateStockItemsDto extends PartialType(CreateStockItemsDto) {
  @ApiProperty({
    description: 'Stock id',
    example: '1',
    required: false
  })
  readonly id?: number;
  @ApiProperty({
    description: 'Product id',
    example: '1',
    required: false
  })
  readonly sequence?: number;

  @ApiProperty({
    description: 'Product id',
    example: '1',
    required: false
  })
  quantity?: number;

  @ApiProperty({
    description: 'Unit price',
    example: '1.00',
    required: false
  })
  unit_price?: number;

  @ApiHideProperty()
  total_price?: number;

  // @ApiProperty({
  //   description: 'Lote',
  //   example: '0001',
  //   required: true
  // })
  // readonly lote?: string;

  // @ApiProperty({
  //   description: 'Expiration date',
  //   example: '2021-05-01',
  //   required: false
  // })
  // readonly expiration?: Date;

  @ApiProperty({
    description: 'Product id',
    example: '1',
    required: false
  })
  supplier?: number;

  @ApiProperty({
    description: 'Costumer id',
    example: '1',
    required: false
  })
  costumer?: number;

  @ApiProperty({
    description: 'Stock location id',
    example: '1',
    required: false
  })
  stock_location_id?: number;

  @ApiProperty({
    description: 'Observation',
    example: 'This is a observation',
    required: false
  })
  observation?: string;

  @ApiProperty({
    description: 'Image link',
    example: 'http://example.com/image.jpg',
    required: false
  })
  image_link?: string;
}
