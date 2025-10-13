import { IsArray, IsInt, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { FacturaItemDto } from './factura-item.dto';

export class CreateFacturaDto {
  @IsInt()
  usuarioId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FacturaItemDto)
  items: FacturaItemDto[];
}