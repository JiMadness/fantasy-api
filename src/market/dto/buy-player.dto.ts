import { IsInstance, IsMongoId } from 'class-validator';
import { Team, TeamDocument } from '../../team/team/team.schema';

export class BuyPlayerDto {
  @IsMongoId()
  entryId: string;

  @IsInstance(Team)
  targetTeam: TeamDocument;
}