export class UpdateCompositionsDto {
  description?: string;
  updated_at: Date;
  updated_by: string;
  production_steps?: object;
  readonly composition_items: UpdateCompositionsItemsDto[];
}
export class UpdateCompositionsItemsDto {
  id?: number;
  sequence?: number;
  quantity?: number;
  updated_at: Date;
  updated_by: string;
}
