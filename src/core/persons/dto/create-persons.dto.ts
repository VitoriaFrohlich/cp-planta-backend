import { ApiProperty } from '@nestjs/swagger';

export class CreatePersonsDto {
  @ApiProperty({
    name: 'Person name',
    minLength: 3,
    example: 'Fruteira do tio João ltda'
  })
  readonly name: string;
}
