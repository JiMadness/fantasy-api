import { IsIn, IsInstance, IsNotEmpty, IsString } from 'class-validator';
import * as CountryList from 'country-list';
import { Team, TeamDocument } from '../team.schema';
import { Schema } from 'mongoose';

export class UpdateTeamPlayerDto {
  @IsInstance(Team)
  team: TeamDocument;

  @IsInstance(Schema.Types.ObjectId)
  playerId: Schema.Types.ObjectId;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsIn(CountryList.getNames())
  country: string;
}