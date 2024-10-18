export class ProductionItem {
  id: number;
  production_order_id: number;
  sequence: number;
  final_product_id: number;
  prodution_quantity_estimated: number;
  production_quantity_real: number;
  production_quantity_loss: number;
  lote: string;
  lote_expiration: string;
  created_at: Date;
  updated_at: Date;
  created_by: number;
  updated_by: number;
}
