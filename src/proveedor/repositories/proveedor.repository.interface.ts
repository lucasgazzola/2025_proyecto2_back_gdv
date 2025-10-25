import { UpdateProductoDto } from 'src/producto/dto/update-producto.dto';
import { CreateProveedorDto } from '../dto/create-proveedor.dto';
import { Proveedor } from '../proveedor.entity';

export const IProveedorRepositoryToken = 'IProveedorRepository';

export interface IProveedorRepository {
  findAll(): Promise<Proveedor[]>;
  findById(id: number): Promise<Proveedor | null>;
  create(createProveedorDto: CreateProveedorDto): Promise<Proveedor>;
  update(id: number, updateProveedorDto: UpdateProductoDto): Promise<Proveedor>;
  delete(id: number): Promise<void>;
}
