import { Filling } from '../../common/enums';

export class ResponseCompositionOrder {
  id: number;
  order: number;
  filling: Filling;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
  compositions_orders_items: ResponseCompositionOrderItem[];
}

export class ResponseCompositionOrderItem {
  id: number;
  compositions_order_id: number;
  sequence: number;
  raw_product: number;
  necessary_quantity: number;
  quantity_received: number;
  diference: number;
  used_batchs: object;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
}
