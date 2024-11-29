import { ApiHideProperty, PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create.products.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Origin } from '../../common/enums';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ApiProperty({
    description: 'Product description',
    minLength: 3,
    required: false,
    example: 'Batata Branca'
  })
  readonly description?: string;

  @ApiHideProperty()
  origin: Origin;

  @ApiProperty({
    description: 'Product category id',
    default: 1,
    required: false,
    example: 'search for the category id in the database'
  })
  readonly category_id?: number;

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
