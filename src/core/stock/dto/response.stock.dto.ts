/* eslint-disable @typescript-eslint/no-explicit-any */
import { Stock_Moviment } from '../../common/enums';

export class ResponseStockDto {
  id: number;
  document_date: Date;
  document_number: string;
  stock_moviment: Stock_Moviment;
  stock_id: number;
  sequence: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  total_price: number;
  batch: string;
  created_at: string;
  updated_at: string;
  // created_by: string;
  // updated_by: string;
}

export class ProductBatch {
  productId: number;
  description: string;
  batchs: {
    batch: string;
    totalQuantity: number;
    batch_expiration: Date | null;
  }[];
}

export class ResponseBatchDto {
  batch: string;
  batch_expiration: Date | null;
}
