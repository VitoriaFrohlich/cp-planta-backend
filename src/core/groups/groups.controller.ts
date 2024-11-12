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
import { GroupsService } from './groups.service';
import { CreateGroupsDto } from './dto/create.groups.dto';
import { UpdateGroupsDto } from './dto/update.groups.dto';
import { ResponseGroupsDto } from './dto/response.groups.dto';

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  async create(
    @Body() createGroupDto: CreateGroupsDto
  ): Promise<ResponseGroupsDto> {
    const matchedGroups = await this.groupsService.matchGroupByData(
      createGroupDto.description
    );

    if ((await matchedGroups).length > 0) {
      const existingGroup = matchedGroups[0];

      if (!existingGroup.active) {
        throw new BadRequestException(
          `Group already exists but is not active. Activate and update it: ${JSON.stringify(
            existingGroup
          )}`
        );
      }

      throw new BadRequestException(
        'Group already exists. Try update it instead'
      );
    }
    const createdGroup = await this.groupsService.create(createGroupDto);

    return {
      id: createdGroup.id,
      description: createdGroup.description,
      created_at: createdGroup.created_at,
      updated_at: createdGroup.updated_at
    };
  }

  @Get()
  async findAll(
    @Query('orderBy') orderBy: string = 'id'
  ): Promise<ResponseGroupsDto[]> {
    const validOrderFields = ['id', 'description'];

    if (!validOrderFields.includes(orderBy)) {
      throw new BadRequestException(`Invalid order field: ${orderBy}`);
    }

    const groups = await this.groupsService.findAll(orderBy);

    return groups.map(group => ({
      id: group.id,
      description: group.description,
      created_at: group.created_at,
      updated_at: group.updated_at
    }));
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<ResponseGroupsDto> {
    const idNumber = +id;
    if (isNaN(idNumber)) {
      throw new BadRequestException('Invalid ID format');
    }

    const group = await this.groupsService.findById(idNumber);

    const response: ResponseGroupsDto = {
      id: group.id,
      description: group.description,
      created_at: group.created_at,
      updated_at: group.updated_at
    };
    return response;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateGroupsDto: UpdateGroupsDto
  ): Promise<ResponseGroupsDto> {
    const idNumber = +id;
    if (isNaN(idNumber)) {
      throw new BadRequestException('Invalid ID format');
    }

    const existingGroup = await this.groupsService.findById(idNumber);

    if (!existingGroup) {
      throw new NotFoundException(`Group with ID ${id} not found`);
    }

    if (!existingGroup.active) {
      throw new BadRequestException(`Group ID ${id} is not active`);
    }

    const updatedGroup = await this.groupsService.update(
      idNumber,
      updateGroupsDto
    );
    return {
      id: updatedGroup.id,
      description: updatedGroup.description,
      created_at: updatedGroup.created_at,
      updated_at: updatedGroup.updated_at
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const idNumber = +id;

    if (isNaN(idNumber)) {
      throw new BadRequestException('Invalid ID format');
    }

    const existingGroup = await this.groupsService.findById(idNumber);
    if (!existingGroup) {
      throw new NotFoundException(`Group with ID ${idNumber} not found`);
    }

    try {
      await this.groupsService.remove(idNumber);

      return { message: `Group with ID ${idNumber} deleted successfully` };
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }

  @Post('activate/:id')
  async activate(@Param('id') id: string) {
    const idNumber = +id;
    if (isNaN(idNumber)) {
      throw new BadRequestException('Invalid ID format');
    }

    await this.groupsService.reactivateGroup(idNumber);

    return { message: `Group ID ${id} activated successfully` };
  }
}
