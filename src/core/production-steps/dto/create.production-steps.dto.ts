import { ApiProperty } from '@nestjs/swagger';

export class CreateProductionStepsDto {
  @ApiProperty({
    description: 'Production Step description',
    minLength: 3,
    example: 'Higienização'
  })
  readonly description: string;
}
