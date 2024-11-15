export class ResponseStockLocationDto {
  id: number;
  description: string;
  active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export class ResponseLocationBatchsDto {
  id: number;
  description: string;
  batch_quantity: number;
}
