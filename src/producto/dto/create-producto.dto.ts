import { ArrayNotEmpty, IsArray, IsInt, IsNumber, IsOptional, IsPositive, IsString, IsUrl } from "class-validator";


export class CreateProductoDto {
  @IsString()
  name: string;

  @IsInt()
  @IsOptional()
  stock?: number;
  
  @IsNumber()
  @IsPositive({ message: 'El precio debe ser mayor a 0' })
  price: number;

  @IsArray()
  @IsUrl({}, { each: true })
  imagesURL: string[];

  @IsInt()
  @IsOptional()
  brandId?: number;

  @IsInt()
  @IsOptional()
  providerId?: number;

  @IsArray()
  @ArrayNotEmpty({ message: 'Debe tener al menos una categoría' })
  @IsInt({ each: true })
  categoryIds?: number[];
}