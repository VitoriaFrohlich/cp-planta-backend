import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Stock_Moviment } from 'src/core/common/enums';
import { object } from 'zod';

export class CreateStockDto {
  @ApiHideProperty()
  readonly document_date: Date;

  @ApiHideProperty()
  readonly document_number: string;

  @ApiProperty({
    description: 'Stock moviment',
    enum: ['INPUT', 'OUTPUT', 'RESERVED'],
    required: true
  })
  readonly stock_moviment: Stock_Moviment;

  @ApiHideProperty()
  readonly is_balance?: boolean;

  @ApiProperty({
    description: 'Stock items',
    type: object,
    required: true
  })
  readonly stock_items: CreateStockItemsDto[];
}

export class CreateStockItemsDto {
  @ApiHideProperty()
  readonly stock_id: number;

  @ApiHideProperty()
  readonly sequence: number;

  @ApiProperty({
    description: 'Product id',
    example: '1',
    required: true
  })
  readonly product_id: number;

  @ApiProperty({
    description: 'Batch',
    example: '123456',
    required: true
  })
  readonly batch: string;

  @ApiProperty({
    description: 'Batch expiration',
    example: '2022-12-31',
    required: true
  })
  readonly batch_expiration: Date;

  @ApiProperty({
    description: 'SKU',
    example: '123456',
    required: true
  })
  readonly sku: string;

  @ApiProperty({
    description: 'Quantity',
    example: '1',
    required: true
  })
  readonly quantity: number;

  @ApiProperty({
    description: 'Unit price',
    example: '1.00',
    required: false
  })
  readonly unit_price?: number;

  @ApiHideProperty()
  readonly total_price?: number;

  @ApiProperty({
    description: 'Stock location id',
    example: '1',
    required: false
  })
  readonly stock_location_id?: number;

  @ApiProperty({
    description: 'Supplier',
    example: '1',
    required: false
  })
  readonly supplier?: number;

  @ApiProperty({
    description: 'Costumer',
    example: '1',
    required: false
  })
  readonly costumer?: number;

  @ApiProperty({
    description: 'Observation',
    example: 'Observação do produto',
    required: false
  })
  readonly observation?: string;

  @ApiProperty({
    description: 'Image',
    required: false,
    type: 'string',
    format: 'binary'
  })
  readonly image?: Buffer;
}
