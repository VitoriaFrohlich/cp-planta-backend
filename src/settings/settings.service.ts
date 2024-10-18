/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@nestjs/common';
import { SettingsRepository } from './settings.repository';
import { settings } from '@prisma/client';

@Injectable()
export class SettingsService {
  constructor(private readonly settingsRepository: SettingsRepository) {}

  async get(key: string): Promise<any> {
    const config = await this.settingsRepository.findByKey(key);
    return config ? config.value : undefined;
  }

  async set(key: string, value: any): Promise<void> {
    await this.settingsRepository.update(key, value);
  }

  async incrementLoteNumber(): Promise<void> {
    await this.settingsRepository.incrementLoteNumber();
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

  async delete(key: string): Promise<void> {
    await this.settingsRepository.delete(key);
  }

  async reactivate(key: string): Promise<void> {
    await this.settingsRepository.reactivate(key);
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
      created_at: config.created_at.toISOString(),
      updated_at: config.updated_at.toISOString()
    };
  }
}
