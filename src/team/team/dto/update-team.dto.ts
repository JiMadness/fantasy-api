import { Team, TeamDocument } from '../team.schema';
import { IsIn, IsInstance, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import * as CountryList from 'country-list';

export class UpdateTeamDto {
  @IsInstance(Team)
  team: TeamDocument;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsIn(CountryList.getNames())
  country?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  password?: string;
}