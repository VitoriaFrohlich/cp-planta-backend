import { Production_Status } from '../../common/enums';

export class UpdateProductionDto {
  readonly production_date: string;
  readonly production_quantity_estimated?: number;
  readonly production_quantity_real?: number;
  readonly production_quantity_loss?: number;
  readonly updated_at: Date;
  readonly updated_by: string;
  readonly Production_Status: Production_Status;
  readonly production_items: UpdateProductionItemDto[];
}

export class UpdateProductionItemDto {
  readonly id: number;
  readonly raw_product_id?: number;
  readonly raw_product_initial_quantity?: number;
  readonly raw_product_used_quantity: number;
  readonly updated_at: Date;
  readonly updated_by: string;
  readonly used_batchs: UpdateProductionBatchDto[];
}

export class UpdateProductionBatchDto {
  readonly stock_item_id: number;
  readonly batch: string;
  readonly quantity: number;
}
