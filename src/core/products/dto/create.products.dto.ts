import { Origin, Unit_Measure } from '../../common/enums';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    description: 'Product description',
    minLength: 3,
    example: 'Batata Branca'
  })
  readonly description: string;

  @ApiProperty({
    description: 'Product code',
    minLength: 3,
    example: 'ABC123'
  })
  readonly code: string;

  @ApiProperty({
    description: 'Product origin',
    default: 'RAW_MATERIAL',
    examples: ['RAW_MATERIAL', 'MADE']
  })
  origin: Origin;

  @ApiProperty({
    description: 'Product unit measure',
    default: 'UN',
    examples: ['UN', 'KG', 'L', 'GR', 'ML', 'PC']
  })
  readonly unit_measure: Unit_Measure;

  @ApiProperty({
    description: 'Product category id',
    default: 1,
    example: 'search for the category id in the database'
  })
  readonly category_id: number;

  @ApiProperty({
    description: 'Product group id',
    default: 1,
    example: 'search for the group id in the database'
  })
  readonly group_id: number;

  @ApiProperty({
    description: 'Product supplier id',
    example: 'search for the supplier id in the database'
  })
  readonly supplier_id: number;

  @ApiProperty({
    description: 'Product nutritional info'
  })
  readonly nutritional_info: string;

  //quantidade e preço vão ser tratados por outro serviço
  @ApiProperty({
    description: 'Product price',
    example: '10.00 or other number > 0'
  })
  readonly price: number;

  @ApiProperty({
    description: 'Product quantity',
    example: 'number > 0'
  })
  readonly quantity: number;
}
