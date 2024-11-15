export class ProductionItem {
  id: number;
  production_order_id: number;
  sequence: number;
  raw_product_id: number;
  raw_product_initial_quantity: number;
  raw_product_used_quantity: number;
  created_at: Date;
  updated_at: Date;
  created_by: string;
  updated_by: string;
  used_batchs: ProductionBatchDto[];
}
export class ProductionBatchDto {
  stock_item_id: number;
  batch: string;
  quantity: number;
}
