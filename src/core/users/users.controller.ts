import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  NotFoundException,
  BadRequestException
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create.users.dto';
import { UpdateUserDto } from './dto/update.users.dto';
import { ResponseUsersDto } from './dto/response.users.dto';
import { Role, Gender } from '../common/enums';
import * as bcrypt from 'bcrypt';
import { ApiQuery } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(
    @Body() createUserDto: CreateUserDto
  ): Promise<ResponseUsersDto> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUserDto = {
      ...createUserDto,
      password: hashedPassword
    };

    const matchedUsers = await this.usersService.matchUserByData(
      newUserDto.email,
      newUserDto.password
    );

    if ((await matchedUsers).length > 0) {
      const existingUser = matchedUsers[0];

      if (!existingUser.active) {
        throw new BadRequestException(
          `User already exists but is not active. Activate and update it: ${JSON.stringify(
            existingUser
          )}`
        );
      }

      throw new BadRequestException(
        'User already exists. Try update it instead'
      );
    }

    const createdUser = await this.usersService.create(newUserDto);
    return {
      id: createdUser.id,
      username: createdUser.username,
      email: createdUser.email,
      role: createdUser.role as Role,
      first_name: createdUser.first_name,
      last_name: createdUser.last_name,
      gender: createdUser.gender as Gender,
      created_at: createdUser.created_at,
      updated_at: createdUser.updated_at
    };
  }

  @Get()
  @ApiQuery({
    name: 'orderBy',
    required: false,
    description:
      'Field to order by. Valid fields: id, username, email, first_name, last_name, gender, role, created_at, updated_at',
    enum: [
      'id',
      'username',
      'email',
      'first_name',
      'last_name',
      'gender',
      'role',
      'created_at',
      'updated_at'
    ]
  })
  async findAll(
    @Query('orderBy') orderBy: string = 'id'
  ): Promise<ResponseUsersDto[]> {
    const validOrderFields = [
      'id',
      'username',
      'email',
      'first_name',
      'last_name',
      'gender',
      'role',
      'created_at',
      'updated_at'
    ];

    if (!validOrderFields.includes(orderBy)) {
      throw new BadRequestException(`Invalid order field: ${orderBy}`);
    }

    const users = await this.usersService.findAll(orderBy);
    return users.map(user => ({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role as Role,
      first_name: user.first_name,
      last_name: user.last_name,
      gender: user.gender as Gender,
      created_at: user.created_at,
      updated_at: user.updated_at
    }));
  }

  @Get(':id')
  findById(@Param('id') id: string): Promise<ResponseUsersDto> {
    const idNumber = +id;
    if (isNaN(idNumber)) {
      throw new BadRequestException('Invalid ID format');
    }

    const user = this.usersService.findById(idNumber);

    return user.then(user => ({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role as Role,
      first_name: user.first_name,
      last_name: user.last_name,
      gender: user.gender as Gender,
      created_at: user.created_at,
      updated_at: user.updated_at
    }));
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<ResponseUsersDto> {
    const idNumber = +id;
    if (isNaN(idNumber)) {
      throw new BadRequestException('Invalid ID format');
    }

    const existingUser = await this.usersService.findById(idNumber);
    if (!existingUser) {
      throw new NotFoundException(`User with ID ${idNumber} not found`);
    }

    if (!existingUser.active) {
      throw new BadRequestException(`User ID ${idNumber} is not active`);
    }

    const updatedUser = await this.usersService.update(idNumber, updateUserDto);

    return {
      id: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role as Role,
      first_name: updatedUser.first_name,
      last_name: updatedUser.last_name,
      gender: updatedUser.gender as Gender,
      created_at: updatedUser.created_at,
      updated_at: updatedUser.updated_at
    };
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Query('softDelete') softDelete?: string
  ) {
    const idNumber = +id;

    if (isNaN(idNumber)) {
      throw new BadRequestException('Invalid ID format');
    }

    const isPermanent = softDelete === 'false';

    await this.usersService.delete(idNumber, isPermanent);

    return { message: `User ID ${idNumber} deleted successfully` };
  }

  @Post('activate/:id')
  async activate(@Param('id') id: string) {
    const idNumber = +id;
    if (isNaN(idNumber)) {
      throw new BadRequestException('Invalid ID format');
    }
    await this.usersService.reactivateUser(idNumber);

    return { message: `User ID ${id} activated successfully` };
  }
}
