import { IsUUID, IsNumber, Min } from 'class-validator';

export class UpdateProgressDto {
  @IsUUID()
  planId: string;

  @IsNumber()
  @Min(0)
  actualValue: number;
}
