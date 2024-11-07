import { Injectable } from '@nestjs/common';
import { SettingsService } from 'src/settings/settings.service';
import { formatISODateToPGDate } from './utils';

@Injectable()
export class BatchService {
  constructor(private readonly settingsService: SettingsService) {}

  private async getNextBatchNumber(): Promise<number> {
    const lastBatchNumberStr =
      await this.settingsService.get('lastBatchNumber');
    const lastBatchNumber = Number(lastBatchNumberStr);
    return lastBatchNumber + 1;
  }

  private calculateExpirationDate(daysToAdd?: number): Date {
    const expirationDate = new Date();
    if (daysToAdd) {
      expirationDate.setDate(expirationDate.getDate() + daysToAdd);
    }
    return expirationDate;
  }

  private async formatBatchNumber(loteNumber: number): Promise<string> {
    const loteNumberLength = await this.settingsService.get('loteNumberLength');
    return loteNumber.toString().padStart(loteNumberLength, '0');
  }

  public async generateBatch(
    type: 'INPUT' | 'OUTPUT',
    daysToExpire?: number
  ): Promise<string> {
    const prefix =
      type === 'INPUT'
        ? await this.settingsService.get('defaultBatchInputMask')
        : await this.settingsService.get('defaultBatchOutputMask');

    const nextBatchNumber = await this.getNextBatchNumber();
    const expirationDate = this.calculateExpirationDate(daysToExpire);

    const formattedExpirationDate = formatISODateToPGDate(
      expirationDate.toISOString()
    );

    const newBatch = `${prefix}${await this.formatBatchNumber(nextBatchNumber)}`;

    await this.settingsService.incrementBatchNumber();

    return `${newBatch}-${formattedExpirationDate}`;
  }
}
