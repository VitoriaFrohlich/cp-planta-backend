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
  unit_measure: string;
  sku: string;
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

export class ResponseProductsWithBatches {
  id: number;
  description: string;
  category: string;
  batch_quantity: number;
}

export class ResponseBatchsByProductDto {
  id: string;
  description: string;
  current_quantity: number;
}

export class ResponseBatchsByRawDto {
  raw_material_description: string;
  measure_unit: string;
  quantity: number;
  //sku: string;
}

export class ResponseRawBatchsByIdDto {
  id: string;
  sku: number;
  measure_unit: string;
  quantity: number;
}

export class ResponseCategoriesBatchsDto {
  id: string;
  description: string;
  batch_quantity: number;
}

export class ResponseProductsWithLocationsDto {
  id: number;
  description: string;
  batch_quantity: number;
}
