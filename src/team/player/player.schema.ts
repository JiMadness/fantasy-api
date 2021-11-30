import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { PlayerPosition } from './player-position.enum';
import { getCodes } from 'country-list';

export type PlayerDocument = Player & Document;

@Schema()
export class Player {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, enum: getCodes() })
  country: string;

  @Prop({ required: true })
  birthYear: number;

  @Prop({ required: true, min: 0 })
  value: number;

  @Prop({ type: String, enum: Object.values(PlayerPosition), required: true })
  position: PlayerPosition;

  age!: number;
}

export const PlayerSchema = SchemaFactory.createForClass(Player);

PlayerSchema.virtual('age').get(() => {
  // @ts-expect-error
  return new Date().getFullYear() - this.birthYear;
});