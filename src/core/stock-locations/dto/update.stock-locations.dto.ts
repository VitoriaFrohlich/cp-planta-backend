import { PartialType } from '@nestjs/swagger';
import { CreateStockLocationDto } from './create.stock-locations.dto';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

export class UpdateStockLocationDto extends PartialType(
  CreateStockLocationDto
) {
  @ApiProperty({
    description: 'Descrição do local de estoque',
    minLength: 3,
    example: 'Depósito Central'
  })
  readonly description?: string;

  @ApiHideProperty()
  readonly active?: boolean;

  @ApiHideProperty()
  readonly updated_at?: Date;

  @ApiHideProperty()
  readonly updated_by?: string;
}
