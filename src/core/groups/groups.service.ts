import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { CreateGroupsDto } from './dto/create.groups.dto';
import { UpdateGroupsDto } from './dto/update.groups.dto';
import { GroupsRepository } from './groups.repository';
import { groups } from '@prisma/client';
import { format } from 'date-fns';
import { SessionService } from '../common/sessionService';

@Injectable()
export class GroupsService {
  constructor(
    private readonly sessionService: SessionService,
    private readonly groupsRepository: GroupsRepository
  ) {}

  async create(createGroupsDto: CreateGroupsDto) {
    const currentUser = this.sessionService.getCurrentUser();

    const createGroup = {
      ...createGroupsDto,
      created_at: new Date(),
      updated_at: new Date(),
      created_by: currentUser,
      updated_by: currentUser
    };

    const createdGroup = await this.groupsRepository.create(createGroup);

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
    const currentUser = this.sessionService.getCurrentUser();
    const group = await this.groupsRepository.findById(id);

    if (!group) {
      throw new NotFoundException(`Group with ID ${id} not found`);
    }

    if (group.active) {
      throw new BadRequestException(`Group with ID ${id} is already active`);
    }
    return this.groupsRepository.reactivate(id, currentUser);
  }

  async matchGroupByData(description: string) {
    const matchedGroup =
      await this.groupsRepository.matchGroupByData(description);

    return matchedGroup.map(group => this.formatGroupDate(group));
  }

  async update(id: number, updateGroupsDto: UpdateGroupsDto) {
    const currentUser = this.sessionService.getCurrentUser();
    const group = await this.isValid(id);

    if (!group) {
      throw new NotFoundException(`group with ID ${id} not found`);
    }
    const updatedGroupsDto = {
      ...updateGroupsDto,
      updated_at: new Date(),
      active: group.active,
      updated_by: currentUser
    };

    const updatedGroup = await this.groupsRepository.update(
      id,
      updatedGroupsDto
    );

    return this.formatGroupDate(updatedGroup);
  }

  remove(id: number) {
    const currentUser = this.sessionService.getCurrentUser();
    return this.groupsRepository.delete(id, currentUser);
  }
}
