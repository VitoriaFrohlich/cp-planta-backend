export class ResponseCompositionsDto {
  id: number;
  final_product: number;
  description: string;
  production_steps: object;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
  composition_items: ResponseCompositionsItem[];
}

export class ResponseCompositionsItem {
  id: number;
  compositions_id: number;
  sequence: number;
  raw_product: number;
  description: string;
  quantity: number;
  created_at: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
}
