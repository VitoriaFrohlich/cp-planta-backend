export class UpdateProductionProgressDto {
  id: number;
  production_id: number;
  step_id: number;
  end_time?: Date;
  total_time?: number;
  final_quantity?: number;
  quantity_loss?: number;
  machine?: string;
  production_line?: string;
  photo?: number[];
  observation?: string;
  operator_id?: number;
  ocurrences?: number[];
  updated_at: Date;
  updated_by: string;
}
