import { IsEmail, IsMongoId, IsNumber, Min } from 'class-validator';

export class TransferTeamPlayerDto {
  @IsEmail()
  sourceTeamEmail: string;

  @IsEmail()
  destinationTeamEmail: string;

  @IsMongoId()
  playerId: string;

  @IsNumber()
  @Min(0)
  sellPrice: number;
}