import { IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdateStepDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  order?: number;
}
