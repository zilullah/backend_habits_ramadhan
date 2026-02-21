import { IsString, IsNumber, IsOptional } from 'class-validator';

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
}
