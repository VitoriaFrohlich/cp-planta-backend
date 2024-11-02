export class ProductionProgress {
  id: number;
  production_id: number;
  step_id: number;
  sequence: number;
  raw_product_id: number;
  start_time: Date;
  end_time?: Date;
  total_time?: number;
  initial_quantity: number;
  final_quantity?: number;
  quantity_loss?: number;
  machine?: string;
  production_line?: string;
  photo?: number[];
  observation?: string;
  operator_id?: number;
  ocurrences?: number[];
  created_at: Date;
  updated_at: Date;
  created_by: string;
  updated_by: string;
}
