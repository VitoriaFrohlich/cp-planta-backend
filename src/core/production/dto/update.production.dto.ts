import { Production_Status } from '../../common/enums';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

export class UpdateProductionDto {
  @ApiProperty({
    description: 'Production date',
    required: false,
    example: '2021-10-01T00:00:00.000Z'
  })
  readonly production_date?: string;

  @ApiHideProperty()
  readonly production_quantity_estimated?: number;

  @ApiHideProperty()
  readonly production_quantity_real?: number;

  @ApiHideProperty()
  readonly production_quantity_loss?: number;

  @ApiHideProperty()
  readonly updated_at: Date;

  @ApiHideProperty()
  readonly updated_by: string;

  @ApiHideProperty()
  readonly Production_Status: Production_Status;

  @ApiProperty({
    description: 'Production items',
    example: [
      {
        raw_product_id: 1,
        raw_product_initial_quantity: 100,
        used_batchs: [
          {
            stock_item_id: 1,
            batch: '1',
            quantity: 100
          }
        ]
      }
    ]
  })
  readonly production_items: UpdateProductionItemDto[];
}

export class UpdateProductionItemDto {
  @ApiProperty({
    description: 'Item ID',
    example: 1,
    required: true
  })
  readonly id: number;

  @ApiProperty({
    description: 'Raw product ID',
    example: 1,
    required: false
  })
  readonly raw_product_id?: number;

  @ApiHideProperty()
  readonly raw_product_initial_quantity?: number;

  @ApiHideProperty()
  readonly raw_product_used_quantity?: number;

  @ApiHideProperty()
  readonly updated_at?: Date;

  @ApiHideProperty()
  readonly updated_by?: string;

  @ApiProperty({
    description: 'Used batchs',
    example: [
      {
        stock_item_id: 1,
        batch: '1',
        quantity: 100
      }
    ]
  })
  readonly used_batchs: UpdateProductionBatchDto[];
}

export class UpdateProductionBatchDto {
  @ApiProperty({
    description: 'Stock item ID',
    example: 1,
    required: true
  })
  readonly stock_item_id: number;

  @ApiProperty({
    description: 'Batch',
    example: 'ABC123',
    required: true
  })
  readonly batch: string;

  @ApiProperty({
    description: 'Quantity',
    example: 100,
    required: true
  })
  readonly quantity: number;
}
