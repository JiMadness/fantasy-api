import { IsEmail, IsInstance, IsNumber, Min } from 'class-validator';
import { Schema } from 'mongoose';

export class PlacePlayerOnTransferListDto {
  @IsEmail()
  email: string;

  @IsInstance(Schema.Types.ObjectId)
  playerId: Schema.Types.ObjectId;

  @IsNumber()
  @Min(0)
  askingPrice: number;
}