import { Production_Status } from '../../common/enums';

export class CreateProductionDto {
  readonly number: number;
  readonly description: string;
  readonly production_date: string;
  readonly final_product_id: number;
  readonly production_quantity_estimated: number;
  readonly production_quantity_real?: number;
  readonly production_quantity_loss?: number;
  readonly created_at: Date;
  readonly updated_at: Date;
  readonly created_by: string;
  readonly updated_by: string;
  readonly Production_Status: Production_Status;
  readonly production_items: CreateProductionItemDto[];
}

export class CreateProductionItemDto {
  readonly id: number;
  readonly production_order_id: number;
  readonly sequence: number;
  readonly raw_product_id: number;
  readonly raw_product_initial_quantity?: number;
  readonly raw_product_used_quantity: number;
  readonly created_at: Date;
  readonly updated_at: Date;
  readonly created_by: string;
  readonly updated_by: string;
  readonly used_batchs: CreateProductionBatchDto[];
}
export class CreateProductionBatchDto {
  readonly stock_item_id: number;
  readonly batch: string;
  readonly quantity: number;
}
