import {
  IsArray,
  IsInt,
  IsOptional,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Producto } from 'src/producto/producto.entity';

export class CreateFacturaItemDto {
  @IsOptional()
  @IsInt()
  invoiceId?: number;

  product: Producto;

  @IsInt()
  quantity: number;

  // unitPrice puede ser decimal (float)
  @IsNumber({}, { message: 'unitPrice must be a number' })
  unitPrice: number;
}

export class CreateFacturaDto {
  // invoiceNumber lo calcula el servidor; permitir que venga vacío
  @IsOptional()
  @IsInt()
  invoiceNumber?: number;

  // userId lo resolvemos a partir del token; permitir que venga vacío
  @IsOptional()
  @IsInt()
  userId?: number;

  // El cliente puede venir como customer: { id: number } o customerId
  @IsOptional()
  @IsInt()
  customerId?: number;

  @IsOptional()
  customer?: any;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFacturaItemDto)
  invoiceDetails: CreateFacturaItemDto[];
}
