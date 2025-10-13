import { FacturaItem } from './factura-item.interface';
import { User } from '../usuario/usuario.interface';
export class Factura {
  id: number;
  usuario: User;
  fecha: Date;
  items: FacturaItem[];
  subtotal: number;
  total: number;
}