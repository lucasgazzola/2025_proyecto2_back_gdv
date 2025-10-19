import { IsEmail, IsNotEmpty, IsEnum, MinLength, IsString, IsOptional } from 'class-validator';
import { Role } from '../../common/enums/roles.enums';


export class CreateUsuarioDto {
  @IsEmail()
  email: string;

  
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  
  @IsString()
  @IsOptional()
  phone?: string;
  

  @IsString()
  @IsOptional()
  address?: string;
  
  @IsString()
  @IsOptional()
  city?: string;
  
  @IsString()
  @IsOptional()
  province?: string;

  @IsEnum(Role)
  role: Role;

  @IsOptional()
  isActive?: boolean;
}
