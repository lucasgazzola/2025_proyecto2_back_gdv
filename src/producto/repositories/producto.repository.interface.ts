import { Producto } from "../producto.entity";
import { CreateProductoDto } from "../dto/create-producto.dto";
import { UpdateProductoDto } from "../dto/update-producto.dto";

export const IProductoRepositoryToken = 'IProductoRepository';

export interface IProductoRepository {
    findAll(): Promise<Producto[]>;
    findById(id: number): Promise<Producto | null>;
    findByIds(ids: number[]): Promise<Producto[]>
    create(dto: CreateProductoDto): Promise<Producto>;
    update(id: number, dto: UpdateProductoDto): Promise<Producto>;
    delete(id: number): Promise<Producto>;
}