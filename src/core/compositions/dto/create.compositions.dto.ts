export class CreateCompositionsDto {
  final_product: number;
  description: string;
  created_at: Date;
  updated_at: Date;
  created_by: string;
  updated_by: string;
  production_steps: object;
  readonly composition_items: CreateCompositionsItemsDto[];
}

export class CreateCompositionsItemsDto {
  readonly composition_id: number;
  readonly sequence: number;
  readonly raw_product: number;
  readonly quantity: number;
  readonly created_at: Date;
  readonly updated_at: Date;
  readonly created_by?: string;
  readonly updated_by?: string;
}
