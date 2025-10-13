import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { Role } from '../../common/enums/roles.enums';

export class RegisterAuthDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsString()
  lastname: string;

  @MinLength(6)
  @IsString()
  password: string;

  @IsEnum(Role)
  role: Role;
}
