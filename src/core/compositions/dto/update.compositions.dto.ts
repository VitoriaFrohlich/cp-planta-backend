import { ApiProperty } from '@nestjs/swagger';

export class UpdateCompositionsDto {
  @ApiProperty({
    description: 'Description is required',
    example: 'Description'
  })
  description?: string;
  updated_at: Date;
  updated_by: string;

  @ApiProperty({
    description: 'Production Steps',
    example: [
      {
        id: 1,
        sequence: 1,
        description: 'Corte'
      },
      {
        id: 2,
        sequence: 2,
        description: 'Descascamento'
      },
      {
        id: 3,
        sequence: 3,
        description: 'Seleção'
      },
      {
        id: 4,
        sequence: 4,
        description: 'Desfolhamento'
      }
    ]
  })
  production_steps?: object;

  @ApiProperty({
    description: 'Items to be used in the composition',
    example: [
      {
        composition_id: 1,
        raw_product: 1,
        quantity: 1
      },
      {
        composition_id: 1,
        raw_product: 2,
        quantity: 2
      }
    ]
  })
  readonly composition_items: UpdateCompositionsItemsDto[];
}
export class UpdateCompositionsItemsDto {
  id?: number;
  sequence?: number;
  quantity?: number;
  updated_at: Date;
  updated_by: string;
}
