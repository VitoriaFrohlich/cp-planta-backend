import { Production_Status } from '../../common/enums';
export class CreateProductionDto {
  readonly number: number;
  readonly description: string;
  readonly production_date: string;
  readonly created_at: Date;
  readonly updated_at: Date;
  readonly created_by: string;
  readonly updated_by: string;
  readonly Production_Status: Production_Status;
  readonly production_items: CreateProductionItemsDto[];
}

export class CreateProductionItemsDto {
  readonly production_order_id: number;
  readonly sequence: number;
  readonly final_product_id: number;
  readonly production_quantity_estimated: number;
  readonly production_quantity_real: number;
  readonly production_quantity_loss: number;
  readonly lote: string;
  readonly lote_expiration: string;
  readonly created_at: Date;
  readonly updated_at: Date;
  readonly created_by: string;
  readonly updated_by: string;
}
