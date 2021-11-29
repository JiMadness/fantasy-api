import { Document, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Player } from './player.schema';

export type TeamDocument = Team & Document;

@Schema()
export class Team {
  @Prop({ lowercase: true, alias: 'email' })
  _id: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  country: string;

  @Prop({ required: true })
  balance: number;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: Player.name, autopopulate: true }] })
  players: Player[];

  value!: number;
}

export const TeamSchema = SchemaFactory.createForClass(Team);

TeamSchema.virtual('value').get(() => {
  // @ts-expect-error
  return this.players.reduce((player, acc) => acc + player.value, 0);
});