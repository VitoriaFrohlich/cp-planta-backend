import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  BadRequestException,
  NotFoundException,
  Delete
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { ResponseSettingsDto } from './dto/settings.response.dto';
import { UpdateSettingsDto } from './dto/update.settings.dto';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  async findAll(
    @Query('orderBy') orderBy: string = 'id'
  ): Promise<ResponseSettingsDto[]> {
    const validOrderFields = ['id', 'key'];

    if (!validOrderFields.includes(orderBy)) {
      throw new Error('Invalid order field');
    }

    const settings = await this.settingsService.findAll(orderBy);
    return settings.map(config => ({
      id: config.id,
      key: config.key,
      value: config.value,
      description: config.description,
      updated_at: config.updated_at,
      updated_by: config.updated_by
    }));
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<ResponseSettingsDto> {
    const idNumber = +id;
    if (isNaN(idNumber)) {
      throw new BadRequestException('Invalid ID format');
    }

    const config = this.settingsService.findById(idNumber);
    return config.then(config => ({
      id: config.id,
      key: config.key,
      value: config.value,
      description: config.description,
      updated_at: config.updated_at,
      updated_by: config.updated_by
    }));
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSettingsDto: UpdateSettingsDto
  ): Promise<ResponseSettingsDto> {
    const idNumber = +id;
    if (isNaN(idNumber)) {
      throw new BadRequestException('Invalid ID format');
    }

    const existingSettings = await this.settingsService.findById(idNumber);
    if (!existingSettings) {
      throw new NotFoundException(`Settings with ID ${id} not found`);
    }
    if (!existingSettings.active) {
      throw new BadRequestException(`Settings ID ${id} is not active`);
    }

    const updated = await this.settingsService.update(
      idNumber,
      updateSettingsDto
    );

    return {
      id: updated.id,
      key: updated.key,
      value: updated.value,
      description: updated.description,
      updated_at: updated.updated_at,
      updated_by: updated.updated_by
    };
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const idNumber = +id;
    if (isNaN(idNumber)) {
      throw new BadRequestException('Invalid ID format');
    }

    const existingSettings = await this.settingsService.findById(idNumber);
    if (!existingSettings) {
      throw new NotFoundException(`Settings with ID ${id} not found`);
    }
    if (!existingSettings.active) {
      throw new BadRequestException(`Settings ID ${id} already is inactive`);
    }

    await this.settingsService.delete(idNumber);

    return { message: `Product ID ${id} inactivated successfully` };
  }

  @Post('activate/:id')
  async activate(@Param('id') id: string) {
    const idNumber = +id;
    if (isNaN(idNumber)) {
      throw new BadRequestException('Invalid ID format');
    }

    const existingSettings = await this.settingsService.findById(idNumber);
    if (!existingSettings) {
      throw new NotFoundException(`Settings with ID ${id} not found`);
    }
    if (existingSettings.active) {
      throw new BadRequestException(`Settings ID ${id} is already active`);
    }

    await this.settingsService.reactivate(idNumber);

    return { message: `Product ID ${id} activated successfully` };
  }
}
