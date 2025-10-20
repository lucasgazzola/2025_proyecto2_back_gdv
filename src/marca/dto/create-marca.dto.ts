import { IsBoolean, IsOptional, IsString  } from "class-validator";


export class CreateMarcaDto {

  @IsString()
  name: string;
  
  @IsString()
  @IsOptional()
  logo?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
