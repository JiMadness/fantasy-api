import { IsEmail, IsIn, IsNotEmpty, IsString } from 'class-validator';
import * as CountryList from 'country-list';

export class CreateTeamDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsIn(CountryList.getNames())
  country: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}