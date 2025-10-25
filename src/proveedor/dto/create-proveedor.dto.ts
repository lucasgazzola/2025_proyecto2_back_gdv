import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateProveedorDto {
  @IsString()
  code: string;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  city?: string;
}
