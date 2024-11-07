/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { SettingsRepository } from './settings.repository';
import { settings } from '@prisma/client';
import { format } from 'date-fns';
import { UpdateSettingsDto } from './dto/update.settings.dto';

@Injectable()
export class SettingsService {
  constructor(private readonly settingsRepository: SettingsRepository) {}

  async get(key: string): Promise<any> {
    const config = await this.settingsRepository.findByKey(key);
    return config ? config.value : undefined;
  }

  async set(key: string, value: any): Promise<void> {
    const config = await this.settingsRepository.findByKey(key);
    if (!config) {
      throw new NotFoundException(`Settings with key ${key} not found`);
    }
    await this.settingsRepository.update(config.id, { value });
  }

  async findById(id: number): Promise<
    Omit<settings, 'created_at' | 'updated_at'> & {
      created_at: string;
      updated_at: string;
    }
  > {
    const config = await this.settingsRepository.findById(id);
    if (!config) {
      throw new NotFoundException(`Settings with ID ${id} not found`);
    }
    return this.formatDate(config);
  }

  async incrementBatchNumber(): Promise<void> {
    const config = await this.settingsRepository.findByKey('lastBatchNumber');
    if (config) {
      const loteNumber = Number(config.value);
      config.value = (loteNumber + 1).toString();

      await this.settingsRepository.updateByKey(config.key, config);
    }
  }

  async incrementOrderNumber(): Promise<void> {
    const config = await this.settingsRepository.findByKey('lastOrderNumber');
    if (config) {
      const orderNumber = Number(config.value);
      config.value = (orderNumber + 1).toString();

      await this.settingsRepository.updateByKey(config.key, config);
    }
  }

  async findAll(orderBy: string): Promise<
    (Omit<settings, 'created_at' | 'updated_at'> & {
      created_at: string;
      updated_at: string;
    })[]
  > {
    const finded = await this.settingsRepository.findAll(orderBy);
    return finded.map(config => this.formatDate(config));
  }

  async update(id: number, updateSettingsDto: UpdateSettingsDto) {
    const updatedconfigDto = {
      ...updateSettingsDto,
      updated_at: new Date(),
      active: true
    };

    const updatedconfig = await this.settingsRepository.update(
      id,
      updatedconfigDto
    );

    return this.formatDate(updatedconfig);
  }

  async delete(id: number): Promise<void> {
    await this.settingsRepository.delete(id);
  }

  async reactivate(id: number) {
    const config = await this.settingsRepository.findById(id);

    if (!config) {
      throw new NotFoundException(`Settings with ID ${id} not found`);
    }

    if (config.active) {
      throw new BadRequestException(`Settings with ID ${id} is already active`);
    }
    return this.settingsRepository.reactivate(id);
  }

  async matchconfigByData(key: string) {
    const matchedconfig = await this.settingsRepository.matchSettingByData(key);
    return matchedconfig.map(config => this.formatDate(config));
  }

  private formatDate(config: settings): Omit<
    settings,
    'created_at' | 'updated_at'
  > & {
    created_at: string;
    updated_at: string;
  } {
    return {
      ...config,
      created_at: format(config.created_at, 'dd-MM-yyyy HH:mm:ss'),
      updated_at: format(config.updated_at, 'dd-MM-yyyy HH:mm:ss')
    };
  }
}
