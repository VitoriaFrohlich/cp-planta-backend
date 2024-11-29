import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create.users.dto';
import { Role, Gender } from '../../common/enums';

export class UpdateUserDto extends PartialType(CreateUserDto) {
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
    description: 'First name of the user',
    examples: ['DEFAULT', 'ADMIN', 'ROOT', 'DEMO', 'API', 'SYSTEM'],
    default: Role.DEFAULT
  })
  readonly role: Role;

  @ApiProperty({
    example: 'John',
    description: 'First name of the user'
  })
  readonly first_name: string;

  @ApiProperty({
    example: 'Doe',
    description: 'Last name of the user'
  })
  readonly last_name: string;

  @ApiProperty({
    example: true,
    description: 'Active user'
  })
  readonly active: boolean;

  @ApiProperty({
    description: 'Gender of the user',
    examples: ['MALE', 'FEMALE', 'OTHER'],
    default: Gender.OTHER
  })
  readonly gender: Gender;
}
