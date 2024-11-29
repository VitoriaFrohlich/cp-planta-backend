import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

export class CreateCompositionsDto {
  @ApiProperty({
    description: 'Final Product ID is required',
    example: 1
  })
  final_product: number;

  @ApiHideProperty()
  description: string;

  @ApiHideProperty()
  created_at: Date;

  @ApiHideProperty()
  updated_at: Date;

  @ApiHideProperty()
  created_by: string;

  @ApiHideProperty()
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
  production_steps: object;

  @ApiProperty({
    description: 'Items to be used in the composition',
    example: [
      {
        raw_product: 1,
        quantity: 1
      },
      {
        raw_product: 2,
        quantity: 2
      }
    ]
  })
  readonly composition_items: CreateCompositionsItemsDto[];
}

export class CreateCompositionsItemsDto {
  @ApiHideProperty()
  readonly composition_id: number;

  @ApiHideProperty()
  readonly sequence: number;

  @ApiProperty({
    description: 'Raw Product ID is required',
    example: 1
  })
  readonly raw_product: number;

  @ApiProperty({
    description: 'Quantity is required',
    example: 1
  })
  readonly quantity: number;

  @ApiHideProperty()
  readonly created_at: Date;

  @ApiHideProperty()
  readonly updated_at: Date;

  @ApiHideProperty()
  readonly created_by?: string;

  @ApiHideProperty()
  readonly updated_by?: string;
}
