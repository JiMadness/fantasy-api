import { Document, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Player, PlayerDocument } from '../player/player.schema';
import { getCodes } from 'country-list';

export type TeamDocument = Team & Document;

@Schema()
export class Team {
  @Prop({ lowercase: true, alias: 'email' })
  _id: string;

  @Prop({ required: true, select: false })
  password?: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, enum: getCodes() })
  country: string;

  @Prop({ required: true, min: 0 })
  balance: number;

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: Player.name, autopopulate: true }],
    default: [],
    required: true,
  })
  players: PlayerDocument[];

  value!: number;
  email!: string;
}

export const TeamSchema = SchemaFactory.createForClass(Team);

TeamSchema.virtual('value').get(() => {
  // @ts-expect-error
  return this.players.reduce((acc, player) => acc + player.value, 0);
});