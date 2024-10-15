import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';
import { users } from '@prisma/client';
import { format } from 'date-fns';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.usersRepository.findByEmail(
      createUserDto.email
    );

    if (existingUser) {
      throw new Error(
        `User already exists: ${JSON.stringify(existingUser[0])}`
      );
    }

    const createdUser = await this.usersRepository.create(createUserDto);

    return this.formatUserDate(createdUser);
  }

  async findAll(orderBy: string): Promise<
    (Omit<users, 'created_at' | 'updated_at'> & {
      created_at: string;
      updated_at: string;
    })[]
  > {
    const findedUsers = await this.usersRepository.findAll(orderBy);
    return findedUsers.map(user => this.formatUserDate(user));
  }

  async findById(id: number) {
    const user = await this.isValid(id);
    return this.formatUserDate(user);
  }

  private formatUserDate(user: users): Omit<
    users,
    'created_at' | 'updated_at'
  > & {
    created_at: string;
    updated_at: string;
  } {
    return {
      ...user,
      created_at: format(new Date(user.created_at), 'dd/MM/yyyy HH:mm:ss'),
      updated_at: format(new Date(user.updated_at), 'dd/MM/yyyy HH:mm:ss')
    };
  }

  async isValid(id: number) {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    } else if (!user.active) {
      throw new BadRequestException(`User with ID ${id} is not active`);
    }
    return user;
  }

  async reactivateUser(id: number) {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (user.active) {
      throw new BadRequestException(`User with ID ${id} is already active`);
    }

    const reactivatedUser = await this.usersRepository.update(id, {
      active: true,
      updated_at: new Date()
    });

    return this.formatUserDate(reactivatedUser);
  }

  async matchUserByData(email: string, username: string) {
    const matchedUser = await this.usersRepository.matchUserByData(
      email,
      username
    );

    return matchedUser.map(user => this.formatUserDate(user));
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.isValid(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    const updatedUserDto = {
      ...updateUserDto,
      updated_at: new Date(),
      active: user.active
    };

    const updatedPorduct = await this.usersRepository.update(
      id,
      updatedUserDto
    );

    return this.formatUserDate(updatedPorduct);
  }

  async remove(id: number) {
    await this.isValid(id);
    await this.usersRepository.delete(id);
  }
}
