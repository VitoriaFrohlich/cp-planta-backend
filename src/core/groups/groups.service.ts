import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { CreateGroupsDto } from './dto/create-groups.dto';
import { UpdateGroupsDto } from './dto/update-groups.dto';
import { GroupsRepository } from './groups.repository';
import { groups } from '@prisma/client';
import { format } from 'date-fns';

@Injectable()
export class GroupsService {
  constructor(private readonly groupsRepository: GroupsRepository) {}

  async create(createGroupsDto: CreateGroupsDto) {
    const existingGroup = await this.matchGroupByData(
      createGroupsDto.description
    );

    if (existingGroup.length > 0) {
      throw new Error(
        `Group already exists: ${JSON.stringify(existingGroup[0])}`
      );
    }

    const createdGroup = await this.groupsRepository.create(createGroupsDto);

    return this.formatGroupDate(createdGroup);
  }

  async findAll(orderBy: string): Promise<
    (Omit<groups, 'created_at' | 'updated_at'> & {
      created_at: string;
      updated_at: string;
    })[]
  > {
    const findedGroups = await this.groupsRepository.findAll(orderBy);
    return findedGroups.map(group => this.formatGroupDate(group));
  }

  async findById(id: number) {
    const group = await this.isValid(id);
    return this.formatGroupDate(group);
  }

  private formatGroupDate(group: groups): Omit<
    groups,
    'created_at' | 'updated_at'
  > & {
    created_at: string;
    updated_at: string;
  } {
    return {
      ...group,
      created_at: format(new Date(group.created_at), 'dd/MM/yyyy HH:mm:ss'),
      updated_at: format(new Date(group.updated_at), 'dd/MM/yyyy HH:mm:ss')
    };
  }

  async isValid(id: number) {
    const group = await this.groupsRepository.findById(id);

    if (!group) {
      throw new NotFoundException(`Group with ID ${id} not found`);
    } else if (!group.active) {
      throw new BadRequestException(`Group with ID ${id} is not active`);
    }
    return group;
  }

  async reactivateGroup(id: number) {
    const group = await this.groupsRepository.findById(id);

    if (!group) {
      throw new NotFoundException(`Group with ID ${id} not found`);
    }

    if (group.active) {
      throw new BadRequestException(`Group with ID ${id} is already active`);
    }
    return this.groupsRepository.reactivate(id);
  }

  async matchGroupByData(description: string) {
    const matchedGroup =
      await this.groupsRepository.matchGroupByData(description);

    return matchedGroup.map(group => this.formatGroupDate(group));
  }

  async update(id: number, updateGroupsDto: UpdateGroupsDto) {
    const group = await this.isValid(id);

    if (!group) {
      throw new NotFoundException(`group with ID ${id} not found`);
    }
    const updatedGroupsDto = {
      ...updateGroupsDto,
      updated_at: new Date(),
      active: group.active
    };

    const updatedGroup = await this.groupsRepository.update(
      id,
      updatedGroupsDto
    );

    return this.formatGroupDate(updatedGroup);
  }

  remove(id: number) {
    return this.groupsRepository.delete(id);
  }
}
