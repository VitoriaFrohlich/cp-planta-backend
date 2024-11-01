/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { Prisma, settings } from '@prisma/client';

@Injectable()
export class SettingsRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(orderBy: string): Promise<settings[]> {
    const validOrderFields = ['id', 'key', 'description'];

    if (!validOrderFields.includes(orderBy)) {
      throw new Error('Invalid order field');
    }

    const result = await this.prisma.settings.findMany({
      where: { active: true },
      orderBy: { [orderBy]: 'asc' }
    });

    return result;
  }

  async findById(id: number): Promise<settings | null> {
    const config = this.prisma.settings.findUnique({
      where: { id }
    });

    if (!config) {
      throw new Error(`Settings with ID ${id} not found`);
    }

    return config;
  }

  async matchSettingByData(key: string): Promise<settings[]> {
    return await this.prisma.settings.findMany({
      where: { key }
    });
  }
  async set(key: string, value: any): Promise<void> {
    const config = await this.findByKey(key);
    if (!config) {
      throw new Error('Setting not found');
    }

    await this.prisma.settings.update({
      where: { key },
      data: {
        value,
        updated_at: new Date()
      }
    });
  }

  async update(
    id: number,
    data: Prisma.settingsUpdateInput
  ): Promise<settings> {
    if (!id) {
      throw new Error('ID not found');
    }
    const exists = await this.findById(id);
    if (!exists) {
      throw new Error('Setting not found');
    }

    const result = await this.prisma.settings.update({
      where: { id },
      data: {
        value: data.value,
        updated_at: new Date()
      }
    });
    return result;
  }

  async updateByKey(
    key: string,
    data: Prisma.settingsUpdateInput
  ): Promise<settings> {
    const config = await this.findByKey(key);
    if (!config) {
      throw new Error('Setting not found');
    }

    const result = await this.prisma.settings.update({
      where: { key },
      data: {
        value: data.value,
        updated_at: new Date()
      }
    });
    return result;
  }

  async findByKey(key: string): Promise<any> {
    const config = this.prisma.settings.findUnique({
      where: { key }
    });
    return config;
  }

  async delete(id: number): Promise<void> {
    await this.prisma.settings.update({
      where: { id },
      data: {
        active: false,
        updated_at: new Date()
      }
    });
  }

  async reactivate(id: number): Promise<void> {
    await this.prisma.settings.update({
      where: { id },
      data: {
        active: true,
        updated_at: new Date()
      }
    });
  }
}
