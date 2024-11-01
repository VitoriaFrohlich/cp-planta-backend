import { PartialType } from '@nestjs/swagger';
import { CreateStockLocationDto } from './create-stock-locations.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateStockLocationDto extends PartialType(
  CreateStockLocationDto
) {
  @ApiProperty({
    description: 'Descrição do local de estoque',
    minLength: 3,
    example: 'Depósito Central'
  })
  readonly description?: string;

  @ApiProperty({
    description: 'Status de atividade do local de estoque',
    default: true,
    example: true
  })
  readonly active?: boolean;

  @ApiProperty({
    description: 'Data de criação do local de estoque',
    example: '2024-01-01T12:00:00.000Z'
  })
  readonly created_at?: Date;

  @ApiProperty({
    description: 'Data da última atualização do local de estoque',
    example: '2024-01-10T12:00:00.000Z'
  })
  readonly updated_at?: Date;
}
