import { ApiProperty } from '@nestjs/swagger';

export class UpdateOccurrenceDto {
  @ApiProperty({
    description:
      'Descrição da ocorrência. (Deve conter no mínimo 10 caracteres)',
    minLength: 10,
    example: 'Problema com a máquina de corte',
    required: false
  })
  readonly description?: string;

  @ApiProperty({
    description: 'ID do usuário que atualizou a ocorrência',
    example: 1
  })
  readonly updated_by: number;
}
