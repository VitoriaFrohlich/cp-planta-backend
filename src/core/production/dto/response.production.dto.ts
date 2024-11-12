import { Production_Status } from '../../common/enums';
export class ResponseProductionDto {
  id: number;
  number: number;
  description: string;
  production_date: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
  Production_Status: Production_Status;
  production_items: ResponseProductionItem[];
}

export class ResponseProductionItem {
  id: number;
  production_order_id: number;
  sequence: number;
  final_product_id: number;
  production_quantity_estimated: number;
  production_quantity_real: number;
  production_quantity_loss: number;
  batch: string;
  batch_expiration: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
}

export class ShortResponseProductionDto {
  id: number;
  description: string;
  Production_Status: string;
}
