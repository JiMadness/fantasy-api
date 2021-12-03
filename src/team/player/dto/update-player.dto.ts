import { IsIn, IsInstance, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Player, PlayerDocument } from '../player.schema';
import * as CountryList from 'country-list';

export class UpdatePlayerDto {
  @IsInstance(Player)
  player: PlayerDocument;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  firstName?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  lastName?: string;

  @IsOptional()
  @IsIn(CountryList.getNames())
  country?: string;
}