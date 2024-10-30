import { ProductionStepsProgress } from './steps_progress.entity';

export class Step {
  id: number;
  description: string;
  active: boolean;
  created_at: Date;
  updated_at: Date;
  created_by: number;
  updated_by: number;
  production_steps_progress: ProductionStepsProgress[];
}
