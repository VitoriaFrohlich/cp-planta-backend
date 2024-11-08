import { ApiProperty } from '@nestjs/swagger';

export class CreateStockLocationDto {
  @ApiProperty({
    description: 'Stock Location description',
    minLength: 3,
    example: 'Freezer'
  })
  readonly description: string;
  readonly active?: boolean;
  readonly created_at?: Date;
  readonly updated_at?: Date;
  readonly created_by?: string;
  readonly updated_by?: string;
}
