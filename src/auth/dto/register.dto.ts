import { IsEmail, IsEnum, IsString, MinLength, IsOptional } from 'class-validator';
import { Role } from '../../common/enums/roles.enums';

export class RegisterAuthDto {
  @IsEmail()
  email: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @MinLength(6)
  @IsString()
  password: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}
