import { Filling } from 'src/core/common/enums';
import { CompositionOrderItem } from './composition.orders.items.entity';

export class CompositionOrder {
  id: number;
  order: number;
  filling: Filling;
  created_at: Date;
  updated_at: Date;
  created_by: string;
  updated_by: string;
  compositions_orders_items: CompositionOrderItem[];
}
