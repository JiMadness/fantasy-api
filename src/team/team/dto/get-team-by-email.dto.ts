import { IsBoolean, IsEmail, IsOptional } from 'class-validator';

export class GetTeamByEmailDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsBoolean()
  getPassword?: boolean;
}