import { Filling } from 'src/core/common/enums';

export class UpdateCompositionOrderDto {
  filling: Filling;
  updated_at: Date;
  updated_by: string;
  readonly compositions_orders_items: UpdateCompositionOrderItemDto[];
}

export class UpdateCompositionOrderItemDto {
  readonly id: number;
  readonly compositions_order_id: number;
  readonly quantity_received: number;
  readonly diference: number;
  readonly used_batchs: object;
  readonly updated_at: Date;
  readonly updated_by?: string;
}
