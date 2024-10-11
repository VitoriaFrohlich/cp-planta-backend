import { ApiProperty } from '@nestjs/swagger';

export class CreateGroupsDto {
  @ApiProperty({
    description: 'Group description',
    minLength: 3,
    example: 'Group x'
  })
  readonly description: string;

  @ApiProperty({
    description: 'Father group id',
    example: 1
  })
  readonly father_id: number;
}
