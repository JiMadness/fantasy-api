import { IsBoolean, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { ClientSession } from 'mongoose';

export class GetTeamByEmailDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsBoolean()
  getPassword?: boolean;

  @IsOptional()
  @IsNotEmpty()
  session?: ClientSession;
}