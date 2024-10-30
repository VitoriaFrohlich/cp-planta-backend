export class CreateStepDto {
  readonly id: number;
  readonly description: string;
  readonly active: boolean;
  readonly created_at: Date;
  readonly updated_at: Date;
  readonly created_by: number;
  readonly updated_by: number;
  readonly production_items: CreateStepProgressDto[];
}
export class CreateStepProgressDto {
  id: number;
  production_id: number;
  step_id: number;
  sequence: number;
  raw_product_id: number;
  start_time: Date;
  end_time: Date;
  total_time: number;
  initial_quantity: number;
  final_quantity: number;
  quantity_loss: number;
  machine: string;
  line_id: number;
  image_link: string;
  photo: string;
  observation: string;
  operator_id: number;
  ocurrences: string;
  created_at: Date;
  updated_at: Date;
  created_by: number;
  updated_by: number;
}
