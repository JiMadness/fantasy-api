import { IsInstance, IsMongoId, IsNumber, Min } from 'class-validator';
import { Team, TeamDocument } from '../../team/team/team.schema';

export class PlacePlayerOnTransferListDto {
  @IsInstance(Team)
  team: TeamDocument;

  @IsMongoId()
  playerId: string;

  @IsNumber()
  @Min(0)
  askingPrice: number;
}