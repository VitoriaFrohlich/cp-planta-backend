import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoriesDto {
  @ApiProperty({
    description: 'Category description',
    minLength: 3,
    example: 'Category'
  })
  readonly description: string;
}
