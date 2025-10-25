import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateProveedorDto {
  @IsString()
  name: string;

  @IsString()
  code: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsBoolean()
  @IsOptional()
  city?: boolean;
}
