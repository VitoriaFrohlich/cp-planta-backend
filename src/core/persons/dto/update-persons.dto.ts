import { ApiProperty } from '@nestjs/swagger';

export class UpdatePersonsDto {
  @ApiProperty({
    name: 'Person name',
    minLength: 3,
    example: 'Empresa do fulano ltda'
  })
  readonly description: string;

  @ApiProperty({
    description: 'Person status',
    example: true
  })
  readonly active: boolean;
}
