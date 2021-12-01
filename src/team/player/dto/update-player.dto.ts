import { IsIn, IsInstance, IsNotEmpty, IsString } from 'class-validator';
import { Player, PlayerDocument } from '../player.schema';
import * as CountryList from 'country-list';

export class UpdatePlayerDto {
  @IsInstance(Player)
  player: PlayerDocument;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsIn(CountryList.getNames())
  country: string;
}