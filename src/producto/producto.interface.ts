import { Marca } from '../marca/marca.interface';
import { Categoria } from '../categoria/categoria.interface';

export class Producto {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  imagen: string;
  marca: Marca;
  categorias: Categoria[];
}