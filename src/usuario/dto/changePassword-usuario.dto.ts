import { IsNotEmpty, Matches, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty()
  old_password: string;

  @IsNotEmpty()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
  @Matches(/[A-Z]/, { message: 'La contraseña debe tener al menos una letra mayúscula.' })
  @Matches(/[a-z]/, { message: 'La contraseña debe tener al menos una letra minúscula.' })
  @Matches(/[0-9]/, { message: 'La contraseña debe tener al menos un número.' })
  new_password: string;

  @IsNotEmpty()
  password_confirm: string;
}
