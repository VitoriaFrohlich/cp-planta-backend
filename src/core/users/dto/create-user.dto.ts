import { Role } from '../../common/enums';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'johndoe@email.com',
    description: 'Email of the user'
  })
  readonly email: string;

  @ApiProperty({
    example: 'abracadabra',
    description: 'Password of the user'
  })
  readonly password: string;

  @ApiProperty({
    example: 'John',
    description: 'Role of the user',
    examples: ['DEFAULT', 'ADMIN', 'ROOT', 'DEMO', 'ERP', 'API', 'SYSTEM'],
    default: Role.DEFAULT
  })
  readonly role: Role;
}
