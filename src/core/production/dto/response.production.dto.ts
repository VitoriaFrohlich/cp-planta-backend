import { Production_Status } from '../../common/enums';
export class ResponseProductionDto {
  id: number;
  number: number;
  description: string;
  production_date: string;
  created_at: string;
  updated_at: string;
  created_by: number;
  updated_by: number;
  Production_Status: Production_Status;
  production_items: ResponseProductionItem[];
}

export class ResponseProductionItem {
  id: number;
  production_order_id: number;
  sequence: number;
  final_product_id: number;
  prodution_quantity_estimated: number;
  production_quantity_real: number;
  production_quantity_loss: number;
  lote: string;
  lote_expiration: string;
  created_at: string;
  updated_at: string;
  created_by: number;
  updated_by: number;
}
