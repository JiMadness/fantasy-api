import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type PlayerDocument = Player & Document;

@Schema()
export class Player {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  country: string;

  @Prop({ required: true })
  birthYear: number;

  @Prop({ required: true })
  value: number;

  age!: number;
}

export const PlayerSchema = SchemaFactory.createForClass(Player);

PlayerSchema.virtual('age').get(() => {
  // @ts-expect-error
  return new Date().getFullYear() - this.birthYear;
});