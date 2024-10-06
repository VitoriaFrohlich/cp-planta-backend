import { PartialType } from '@nestjs/swagger';
import { CreateOccurrenceDto } from './create-occurrence.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOccurrenceDto extends PartialType(CreateOccurrenceDto) {
  @ApiProperty()
  readonly name: string;

  @ApiProperty()
  readonly price: number;

  @ApiProperty()
  readonly stock: number;
}
