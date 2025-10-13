import { Injectable } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { ProductoRepository } from './producto.repository';
import { MarcaRepository } from '../marca/marca.repository';
import { CategoriaRepository } from '../categoria/categoria.repository';
import { Producto } from './producto.interface';
import { Categoria } from '../categoria/categoria.interface';

@Injectable()
export class ProductoService {
  constructor(
    private readonly productoRepo: ProductoRepository,
    private readonly marcaRepo: MarcaRepository,
    private readonly categoriaRepo: CategoriaRepository,
  ) {}

  async create(dto: CreateProductoDto): Promise<Producto> {
    const marca = await this.marcaRepo.findById(dto.marcaId);
    if (!marca) throw new Error('Marca no encontrada');

    const categorias = await Promise.all(
      dto.categoriaIds.map(id => this.categoriaRepo.findById(id))
    );
    if (categorias.includes(null)) throw new Error('Una o más categorías no existen');

    if (dto.precio <= 0) {
      throw new Error('El precio debe ser mayor a 0');
    }

    if (!dto.categoriaIds || dto.categoriaIds.length === 0) {
      throw new Error('Debe tener al menos una categoría');
    }
    
    return this.productoRepo.create({
      nombre: dto.nombre,
      descripcion: dto.descripcion,
      precio: dto.precio,
      imagen: dto.imagen,
      marca,
      categorias: categorias as Categoria[],
    });
  }

  findAll() {
    return this.productoRepo.findAll();
  }

  findOne(id: number) {
    return this.productoRepo.findById(id);
  }

  async update(id: number, dto: UpdateProductoDto) {
    const producto = await this.productoRepo.findById(id);
    if (!producto) throw new Error('Producto no encontrado');

    let marca = producto.marca;
    if (dto.marcaId) {
      const nuevaMarca = await this.marcaRepo.findById(dto.marcaId);
      if (!nuevaMarca) throw new Error('Marca no encontrada');
      marca = nuevaMarca;
    }

    let categorias = producto.categorias;
    if (dto.categoriaIds) {
      const nuevas = await Promise.all(
        dto.categoriaIds.map(id => this.categoriaRepo.findById(id))
      );
      if (nuevas.includes(null)) throw new Error('Una o más categorías no existen');
      categorias = nuevas as Categoria[];
    }

    return this.productoRepo.update(id, {
      ...dto,
      marca,
      categorias,
    });
  }

  remove(id: number) {
    return this.productoRepo.delete(id);
  }
}