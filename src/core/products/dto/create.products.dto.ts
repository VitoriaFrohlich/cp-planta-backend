import { Origin, Unit_Measure } from '../../common/enums';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    description: 'Product description',
    minLength: 3,
    required: true,
    example: 'Batata Branca'
  })
  readonly description: string;

  @ApiProperty({
    description: 'Product code',
    minLength: 3,
    required: true,
    example: 'ABC123'
  })
  readonly code: string;

  @ApiHideProperty()
  origin: Origin;

  @ApiProperty({
    description: 'Product unit measure',
    default: 'UN',
    required: false,
    examples: ['UN', 'KG', 'L', 'GR', 'ML', 'PC']
  })
  readonly unit_measure: Unit_Measure;

  @ApiProperty({
    description: 'Product category id',
    default: 1,
    required: true,
    example: 'search for the category id in the database'
  })
  readonly category_id: number;

  @ApiProperty({
    description: 'Product group id',
    default: 1,
    required: false,
    example: 'search for the group id in the database'
  })
  readonly group_id?: number;

  @ApiProperty({
    description: 'Product supplier id',
    required: false,
    example: 'search for the supplier id in the database'
  })
  readonly supplier_id?: number;

  @ApiProperty({
    description: 'Product nutritional info',
    required: false
  })
  readonly nutritional_info?: string;
}
