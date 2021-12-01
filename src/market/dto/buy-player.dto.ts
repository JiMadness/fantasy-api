import { Schema } from 'mongoose';
import { IsEmail, IsInstance } from 'class-validator';

export class BuyPlayerDto {
  @IsInstance(Schema.Types.ObjectId)
  entryId: Schema.Types.ObjectId;

  @IsEmail()
  email: string;
}