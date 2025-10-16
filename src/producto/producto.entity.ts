import { Marca } from '../marca/marca.entity';
import { Categoria } from '../categoria/categoria.entity';
import { Proveedor } from 'src/proveedor/proveedor.entity';

export class Producto {
  public readonly id: number;
  public name: string;
  public price: number;
  public stock: number;
  public description?: string;
  public imagesURL: string[];
  public brandId?: number;
  public brand?: Marca;
  public categories: Categoria[];
  public providerId?: number;
  public provider?: Proveedor;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
   
}