import { ApiProperty } from '@nestjs/swagger';

export class CreateOccurrenceDto {
  @ApiProperty({
    description:
      'Descrição da ocorrência. (Deve conter no mínimo 10 caracteres)',
    minLength: 10,
    example: 'Problema com a máquina de corte'
  })
  readonly description: string;
}
