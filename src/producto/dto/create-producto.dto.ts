import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductoDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  name: string;

  @IsInt()
  @IsOptional()
  stock?: number;

  @IsNumber({}, { message: 'El precio debe ser un número válido' })
  @IsPositive({ message: 'El precio debe ser mayor a 0' })
  price: number;

  @IsNotEmpty({ message: 'La imagen es obligatoria' })
  @IsString()
  @IsOptional()
  imageURL?: string;

  @IsInt()
  @IsOptional()
  brandId?: number;

  @IsInt()
  @IsOptional()
  providerId?: number;

  @IsArray()
  @ArrayNotEmpty({ message: 'Debe tener al menos una categoría' })
  @Type(() => Number)
  @IsInt({ each: true })
  categoryIds?: number[];
}
