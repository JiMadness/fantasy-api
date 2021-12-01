import { Document, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Player } from '../team/player/player.schema';
import { Team } from '../team/team/team.schema';

export type MarketDocument = Market & Document;

@Schema()
export class Market {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: Player.name, required: true, unique: true, autopopulate: true })
  player: Player;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: Team.name, required: true })
  ownerTeam: Team;

  @Prop({ required: true })
  askingPrice: number;
}

export const MarketSchema = SchemaFactory.createForClass(Market);