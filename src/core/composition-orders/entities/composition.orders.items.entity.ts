import { CompositionOrder } from './composition.orders.entity';

export class CompositionOrderItem {
  id: number;
  compositions_order_id: number;
  sequence: number;
  raw_product: number;
  necessary_quantity: number;
  quantity_received: number;
  diference: number;
  used_batchs: object;
  created_at: Date;
  updated_at: Date;
  created_by: string;
  updated_by: string;
  compositions: CompositionOrder;
}
