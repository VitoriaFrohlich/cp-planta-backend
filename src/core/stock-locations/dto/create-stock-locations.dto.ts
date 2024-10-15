import { ApiProperty } from '@nestjs/swagger';

export class CreateStockLocationDto {
  @ApiProperty({
    description: 'Stock Location description',
    minLength: 3,
    example: 'Freezer'
  })
  readonly description: string;
}
