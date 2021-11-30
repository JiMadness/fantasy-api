import { IsNotEmpty } from 'class-validator';
import { Schema } from 'mongoose';

export class EnhancePlayerValueDto {
  @IsNotEmpty()
  playerId: Schema.Types.ObjectId;
}