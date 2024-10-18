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
    return config;
  }

  async update(
    key: string,
    data: Prisma.settingsUpdateInput
  ): Promise<settings> {
    const config = await this.prisma.settings.update({
      where: { key },
      data: {
        ...data,
        updated_at: new Date()
      }
    });

    return config;
  }

  async incrementLoteNumber(): Promise<void> {
    const config = await this.findByKey('lastLoteNumber');
    if (config) {
      config.value += 1;
      await this.update(config.key, config);
    }
  }

  async findByKey(key: string): Promise<settings | null> {
    const config = this.prisma.settings.findUnique({
      where: { key }
    });
    return config;
  }

  async delete(key: string): Promise<void> {
    if (!key) {
      throw new Error('ID not found');
    }
    const exists = await this.findByKey(key);
    if (!exists) {
      throw new Error('Setting not found');
    }

    await this.prisma.settings.update({
      where: { key },
      data: {
        active: false,
        updated_at: new Date()
      }
    });
  }

  async reactivate(key: string): Promise<void> {
    if (!key) {
      throw new Error('ID not found');
    }
    const exists = await this.findByKey(key);
    if (!exists) {
      throw new Error('Setting not found');
    }

    await this.prisma.settings.update({
      where: { key },
      data: {
        active: true,
        updated_at: new Date()
      }
    });
  }
}
