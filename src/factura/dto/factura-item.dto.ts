import { IsInt, Min } from 'class-validator';

export class FacturaItemDto {
  @IsInt()
  productoId: number;

  @IsInt()
  @Min(1)
  cantidad: number;
}