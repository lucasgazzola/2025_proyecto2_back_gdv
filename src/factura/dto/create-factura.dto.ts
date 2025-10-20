import { IsArray, IsInt, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateFacturaItemDto {

  @IsInt()
  invoiceId: number;

  @IsInt()
  productId: number;

  @IsInt()
  quantity: number;

  @IsInt()
  providerId: number;

  @IsInt()
  unitPrice: number;
}

export class CreateFacturaDto {

  @IsInt()
  invoiceNumber: number;

  @IsInt()
  userId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFacturaItemDto)
  items: CreateFacturaItemDto[];
}