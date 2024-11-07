import { ProductionItem } from './production-item.entity';
import { Production_Status } from '../../common/enums';

export class Production {
  id: number;
  number: number;
  description: string;
  production_date: Date;
  created_at: Date;
  updated_at: Date;
  created_by: string;
  updated_by: string;
  Production_Status: Production_Status;
  production_items: ProductionItem[];
}
