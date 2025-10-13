import { ArrayNotEmpty, IsArray, IsInt, IsNumber, IsPositive, IsString, IsUrl } from "class-validator";


export class CreateProductoDto {
  @IsString()
  nombre: string;

  @IsString()
  descripcion?: string;
  
  @IsNumber()
  @IsPositive({ message: 'El precio debe ser mayor a 0' })
  precio: number;

  @IsUrl()
  imagen: string;

  @IsInt()
  marcaId: number;

  @IsArray()
  @ArrayNotEmpty({ message: 'Debe tener al menos una categoría' })
  @IsInt({ each: true })
  categoriaIds: number[];
}