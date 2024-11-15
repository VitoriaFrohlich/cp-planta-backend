import { Production_Status } from '../../common/enums';

export class ResponseProductionDto {
  id: number;
  number: number;
  description: string;
  production_date: string;
  final_product_id: number;
  production_quantity_estimated: number;
  production_quantity_real: number;
  production_quantity_loss: number;
  created_at?: string;
  updated_at?: string;
  Production_Status: Production_Status;
  production_items: ResponseProductionItem[];
}

export class ResponseProductionItem {
  id: number;
  production_order_id: number;
  sequence: number;
  raw_product_id: number;
  raw_product_initial_quantity?: number;
  raw_product_used_quantity: number;
  created_at?: string;
  updated_at?: string;
  used_baths: object;
}

export class ShortResponseProductionDto {
  id: number;
  description: string;
  Production_Status: string;
}
