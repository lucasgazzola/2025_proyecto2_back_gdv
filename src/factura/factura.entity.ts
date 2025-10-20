import { User } from '../usuario/usuario.entity';
import { Producto } from '../producto/producto.entity';

export class FacturaItem {
  id: number;
  invoiceId?: number;
  productId: number;
  product: Producto;
  quantity: number;
  unitPrice: number;
  subtotal: number;

}

export class Factura {
  id: number;
  invoiceNumber: number;
  userId: number;
  user: User;
  total: number;
  items: FacturaItem[];
  createdAt: Date;
  updatedAt: Date;
  
}

