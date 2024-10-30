export class ProductionStepsProgress {
  id: number;
  production_id: number;
  step_id: number;
  sequence: number;
  raw_product_id: number;
  start_time?: Date;
  end_time?: Date;
  total_time?: number;
  initial_quantity?: number;
  final_quantity?: number;
  quantity_loss?: number;
  machine?: string;
  line_id?: number;
  image_link?: string;
  photo?: Buffer;
  observation?: string;
  operator_id?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ocurrences?: any;
  created_at: Date;
  updated_at: Date;

  created_by?: number;

  //ocurrences_of_production_stages: OccurrencesOfProductionStages[];
}
