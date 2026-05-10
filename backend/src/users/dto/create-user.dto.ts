import { IsEmail, IsString, IsNumber } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  password!: string;

  @IsString()
  role!: string;

  @IsNumber()
  organizationId!: number;
}
