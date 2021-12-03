import { IsIn, IsInstance, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import * as CountryList from 'country-list';
import { Team, TeamDocument } from '../team.schema';

export class UpdateTeamPlayerDto {
  @IsInstance(Team)
  team: TeamDocument;

  @IsMongoId()
  playerId: string;

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