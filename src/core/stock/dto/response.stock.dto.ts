/* eslint-disable @typescript-eslint/no-explicit-any */
import { Stock_Moviment } from '../../common/enums';

export class ResponseStockDto {
  id: number;
  document_date: string;
  document_number: string;
  stock_moviment: Stock_Moviment;
  created_at?: string;
  updated_at?: string;
  stock_items: ResponseStockItems[];
}

export class ResponseStockItems {
  id: number;
  sequence: number;
  product_id: number;
  description: string;
  quantity: number;
  unit_price?: number;
  total_price?: number;
  batch: string;
  batch_expiration: string;
  observation?: string;
  supplier?: string;
  costumer?: string;
  stock_location_id?: number;
  stock_location?: string;
  created_at?: string;
  updated_at?: string;
}

export class ProductBatch {
  productId: number;
  description: string;
  batchs: {
    batch: string;
    totalQuantity: number;
    batch_expiration: string | null;
  }[];
}

export class ResponseBatchDto {
  batch: string;
  batch_expiration: string | null;
}

export class ProductBatchByCategory {
  category_name: string;
  product_id: number;
  description: string;
  batchs: {
    batch: string;
    batch_expiration: string | null;
    totalQuantity: number;
  }[];
}
