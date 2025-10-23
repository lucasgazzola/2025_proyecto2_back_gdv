import {
  IsEmail,
  IsEnum,
  IsString,
  MinLength,
  IsOptional,
  Matches,
} from 'class-validator';
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
  @Matches(/(?=.*[A-Z])/, {
    message: 'La contraseña debe contener al menos una letra mayúscula',
  })
  @Matches(/(?=.*[a-z])/, {
    message: 'La contraseña debe contener al menos una letra minúscula',
  })
  @Matches(/(?=.*\d)/, {
    message: 'La contraseña debe contener al menos un número',
  })
  password: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}
