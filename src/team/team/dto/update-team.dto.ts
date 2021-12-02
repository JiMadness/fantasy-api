import { Team, TeamDocument } from '../team.schema';
import { IsIn, IsInstance, IsNotEmpty, IsString } from 'class-validator';
import * as CountryList from 'country-list';

export class UpdateTeamDto {
  @IsInstance(Team)
  team: TeamDocument;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsIn(CountryList.getNames())
  country: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}