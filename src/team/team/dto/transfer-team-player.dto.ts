import { Schema } from 'mongoose';
import { IsEmail, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class TransferTeamPlayerDto {
  @IsEmail()
  sourceTeamEmail: string;

  @IsEmail()
  destinationTeamEmail: string;

  @IsNotEmpty()
  playerId: Schema.Types.ObjectId;

  @IsNumber()
  @Min(0)
  sellPrice: number;
}