import { Filling } from 'src/core/common/enums';

export class CreateCompositionOrderDto {
  order: number;
  filling: Filling;
  created_at: Date;
  updated_at: Date;
  created_by: string;
  updated_by: string;
  readonly compositions_orders_items: CreateCompositionOrderItemDto[];
}

export class CreateCompositionOrderItemDto {
  readonly compositions_order_id: number;
  readonly sequence: number;
  readonly raw_product: number;
  readonly necessary_quantity: number;
  readonly quantity_received: number;
  readonly diference: number;
  readonly used_batchs: object;
  readonly created_at: Date;
  readonly updated_at: Date;
  readonly created_by?: string;
  readonly updated_by?: string;
}
