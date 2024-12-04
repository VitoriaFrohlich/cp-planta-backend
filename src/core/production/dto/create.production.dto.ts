import { Production_Status } from '../../common/enums';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

export class CreateProductionDto {
  @ApiHideProperty()
  readonly number: number;

  @ApiHideProperty()
  readonly description: string;

  @ApiProperty({
    description: 'Production date',
    required: true,
    example: '2021-10-01T00:00:00.000Z'
  })
  readonly production_date: string;

  @ApiProperty({
    description: 'Final product ID',
    example: 1,
    required: true
  })
  readonly final_product_id: number;

  @ApiHideProperty()
  readonly production_quantity_estimated: number;

  @ApiHideProperty()
  readonly production_quantity_real?: number;

  @ApiHideProperty()
  readonly production_quantity_loss?: number;

  @ApiHideProperty()
  readonly created_at: Date;

  @ApiHideProperty()
  readonly updated_at: Date;

  @ApiHideProperty()
  readonly created_by: string;

  @ApiHideProperty()
  readonly updated_by: string;

  @ApiHideProperty()
  readonly Production_Status: Production_Status;

  @ApiProperty({
    description: 'Production items',
    required: true,
    example: [
      {
        raw_product_id: 1,
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
  readonly production_items: CreateProductionItemDto[];
}

export class CreateProductionItemDto {
  @ApiHideProperty()
  readonly id: number;

  @ApiHideProperty()
  readonly production_order_id: number;

  @ApiHideProperty()
  readonly sequence: number;

  @ApiProperty({
    description: 'Raw product ID',
    example: 1,
    required: true
  })
  readonly raw_product_id: number;

  @ApiHideProperty()
  readonly raw_product_initial_quantity?: number;

  @ApiHideProperty()
  readonly raw_product_used_quantity: number;

  @ApiHideProperty()
  readonly created_at: Date;

  @ApiHideProperty()
  readonly updated_at: Date;

  @ApiHideProperty()
  readonly created_by: string;

  @ApiHideProperty()
  readonly updated_by: string;

  @ApiProperty({
    description: 'Used batchs',
    required: true,
    example: [
      {
        stock_item_id: 1,
        batch: '1',
        quantity: 100
      }
    ]
  })
  readonly used_batchs: CreateProductionBatchDto[];
}
export class CreateProductionBatchDto {
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
