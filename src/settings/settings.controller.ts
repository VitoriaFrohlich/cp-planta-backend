/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query
} from '@nestjs/common';
import { SettingsService } from './settings.service';
//import { ZodError } from 'zod';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get(':key')
  async getConfig(@Param('key') key: string) {
    return this.settingsService.get(key);
  }

  @Patch(':key')
  async updateConfig(@Param('key') key: string, @Body('value') value: any) {
    await this.settingsService.set(key, value);
    return { message: 'Settings updated successfully' };
  }

  @Get()
  async findAll(@Query('orderBy') orderBy: string = 'id') {
    const validOrderFields = ['id', 'key', 'description'];

    if (!validOrderFields.includes(orderBy)) {
      throw new Error('Invalid order field');
    }

    const settings = await this.settingsService.findAll(orderBy);
    return settings;
  }

  @Delete(':key')
  async delete(@Param('key') key: string) {
    await this.settingsService.delete(key);
    return { message: 'Settings deleted successfully' };
  }

  @Post('reactivate/:key')
  async reactivate(@Param('key') key) {
    await this.settingsService.reactivate(key);
    return { message: 'Settings reactivated successfully' };
  }
}
