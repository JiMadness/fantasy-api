import { IsInstance, IsNumber, Min } from 'class-validator';
import { Schema } from 'mongoose';
import { Team, TeamDocument } from '../../team/team/team.schema';

export class PlacePlayerOnTransferListDto {
  @IsInstance(Team)
  team: TeamDocument;

  @IsInstance(Schema.Types.ObjectId)
  playerId: Schema.Types.ObjectId;

  @IsNumber()
  @Min(0)
  askingPrice: number;
}