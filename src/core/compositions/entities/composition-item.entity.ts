import { Compositions } from './composition.entity';

export class CompositionsItem {
  id: number;
  compositions_id: number;
  sequence: number;
  raw_product: number;
  quantity: number;
  created_at: Date;
  updated_at: Date;
  created_by: string;
  updated_by: string;
  compositions: Compositions;
}
