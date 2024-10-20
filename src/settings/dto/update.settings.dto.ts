import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

export class UpdateSettingsDto {
  @ApiHideProperty()
  readonly id: number;
  @ApiHideProperty()
  readonly key: string;

  @ApiProperty({
    description: 'Configuration value',
    example: '10'
  })
  readonly value: string;

  @ApiProperty({
    description: 'State of activity of the configuration',
    default: true,
    example: true
  })
  active?: boolean;
  updated_at: Date;
  updated_by: string;
}
