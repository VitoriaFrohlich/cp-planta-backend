import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

export class CreateStockLocationDto {
  @ApiProperty({
    description: 'Stock Location description',
    minLength: 3,
    example: 'Freezer'
  })
  readonly description: string;

  @ApiHideProperty()
  readonly active?: boolean;

  @ApiHideProperty()
  readonly created_at?: Date;

  @ApiHideProperty()
  readonly updated_at?: Date;

  @ApiHideProperty()
  readonly created_by?: string;

  @ApiHideProperty()
  readonly updated_by?: string;
}
