import { Production_Status } from '../../common/enums';
//import { ApiProperty } from '@nestjs/swagger';
export class UpdateProductionDto {
  readonly description: string;
  readonly production_date: string;
  readonly updated_at: Date;
  readonly updated_by: string;
  readonly Production_Status: Production_Status;
  readonly production_items: UpdateProductionItemsDto[];
}

export class UpdateProductionItemsDto {
  readonly prodution_quantity_estimated: number;
  readonly production_quantity_real: number;
  readonly production_quantity_loss: number;
  readonly updated_at: Date;
  readonly updated_by: string;
  production_order_id?: number;
  final_product_id?: number;
  lote?: string;
  lote_expiration?: string;
}
