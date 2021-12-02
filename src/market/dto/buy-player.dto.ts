import { Schema } from 'mongoose';
import { IsInstance } from 'class-validator';
import { Team, TeamDocument } from '../../team/team/team.schema';

export class BuyPlayerDto {
  @IsInstance(Schema.Types.ObjectId)
  entryId: Schema.Types.ObjectId;

  @IsInstance(Team)
  targetTeam: TeamDocument;
}