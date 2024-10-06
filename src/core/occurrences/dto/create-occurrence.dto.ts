import { ApiProperty } from '@nestjs/swagger';

export class CreateOccurrenceDto {
  @ApiProperty()
  readonly name: string;

  @ApiProperty()
  readonly price: number;

  @ApiProperty()
  readonly stock: number;
}
