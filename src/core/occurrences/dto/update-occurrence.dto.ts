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
}
