import { IsBoolean, IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class CreateMarcaDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  name: string;

  // El campo `logo` se establece en el servidor cuando el frontend sube
  // un archivo de imagen (multipart/form-data). En las peticiones normales
  // el body no necesita enviar `logo` como string; el servidor guardará
  // la ruta/URL del archivo y la asignará aquí.
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
