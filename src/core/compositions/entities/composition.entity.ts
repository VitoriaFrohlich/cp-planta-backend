import { CompositionsItem } from './composition-item.entity';

export class Compositions {
  id: number;
  final_product: number;
  description: string;
  production_steps: number[];
  created_at: Date;
  updated_at: Date;
  created_by: string;
  updated_by: string;
  compositions_items: CompositionsItem[];
}
