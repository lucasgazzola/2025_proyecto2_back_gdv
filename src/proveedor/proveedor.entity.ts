import { Producto } from 'src/producto/producto.entity';

export class Proveedor {
  public readonly id: number;
  public name: string;
  public email?: string;
  public phone?: string;
  public address?: string;
  public city?: string;
  public province?: string;
  public products?: Producto[];
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
}