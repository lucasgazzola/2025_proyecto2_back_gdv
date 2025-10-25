import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateProveedorDto {
  @IsString()
  code: string;

  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsBoolean()
  @IsOptional()
  city?: boolean;
}
