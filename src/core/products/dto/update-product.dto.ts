import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ApiProperty({
    description: 'Product description',
    minLength: 3,
    example: 'Batata Branca'
  })
  readonly description: string;

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

  @ApiProperty({
    description: 'Product status',
    default: true
  })
  readonly status: boolean;

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
