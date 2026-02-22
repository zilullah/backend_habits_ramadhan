import { IsString, IsNumber, IsOptional, IsDateString } from 'class-validator';

export class CreateHabitDto {
  @IsString()
  name: string;

  @IsNumber()
  totalTarget: number;

  @IsString()
  targetUnit: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  durationDays: number;

  @IsDateString()
  startDate: string;
}
