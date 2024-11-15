import { ProductionItem } from './production-item.entity';
import { Production_Status } from '../../common/enums';

export class Production {
  id: number;
  number: number;
  description: string;
  production_date: Date;
  final_product_id: number;
  production_quantity_estimated: number;
  production_quantity_real?: number;
  production_quantity_loss?: number;
  created_at: Date;
  updated_at: Date;
  created_by: string;
  updated_by: string;
  Production_Status: Production_Status;
  production_item: ProductionItem;
}
