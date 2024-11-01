import { Injectable } from '@nestjs/common';
import { SettingsService } from 'src/settings/settings.service';
import { formatISODateToPGDate } from './utils';

@Injectable()
export class LoteService {
  constructor(private readonly settingsService: SettingsService) {}

  private async getNextLoteNumber(): Promise<number> {
    const lastLoteNumberStr = await this.settingsService.get('lastLoteNumber');
    const lastLoteNumber = Number(lastLoteNumberStr); // Converte para número
    return lastLoteNumber + 1;
  }

  private calculateExpirationDate(daysToAdd?: number): Date {
    const expirationDate = new Date();
    if (daysToAdd) {
      expirationDate.setDate(expirationDate.getDate() + daysToAdd);
    }
    return expirationDate;
  }

  private async formatLoteNumber(loteNumber: number): Promise<string> {
    const loteNumberLength = await this.settingsService.get('loteNumberLength');
    return loteNumber.toString().padStart(loteNumberLength, '0');
  }

  public async generateLote(
    type: 'INPUT' | 'OUTPUT',
    daysToExpire?: number
  ): Promise<string> {
    const prefix =
      type === 'INPUT'
        ? await this.settingsService.get('defaultLoteInputMask')
        : await this.settingsService.get('defaultLoteOutputMask');

    const nextLoteNumber = await this.getNextLoteNumber();
    const expirationDate = this.calculateExpirationDate(daysToExpire);

    const formattedExpirationDate = formatISODateToPGDate(
      expirationDate.toISOString()
    );

    const newLote = `${prefix}${await this.formatLoteNumber(nextLoteNumber)}`;

    await this.settingsService.incrementLoteNumber();

    return `${newLote}-${formattedExpirationDate}`;
  }
}
