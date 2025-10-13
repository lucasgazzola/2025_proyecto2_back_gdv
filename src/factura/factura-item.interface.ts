import { Producto } from 'src/producto/producto.interface';

export class FacturaItem {
  producto: Producto;
  cantidad: number;
  precioUnitario: number;
  total: number;
}