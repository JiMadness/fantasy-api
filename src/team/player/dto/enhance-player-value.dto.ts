import { IsInstance } from 'class-validator';
import { Player, PlayerDocument } from '../player.schema';

export class EnhancePlayerValueDto {
  @IsInstance(Player)
  player: PlayerDocument;
}