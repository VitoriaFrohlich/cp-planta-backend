import { Ocurrence_of_production_stages } from './ocurrences_of_production_stages.entity';

export class Occurrence {
  id: number;
  description: string;
  created_at: Date;
  updated_at: Date;
  created_by: number;
  updated_by: number;
  ocurrence_of_production_stages: Ocurrence_of_production_stages[];
}
