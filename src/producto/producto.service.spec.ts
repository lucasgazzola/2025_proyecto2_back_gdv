import { ProductoService } from './producto.service';
import { ProductoRepository } from './producto.repository';
import { MarcaRepository } from '../marca/marca.repository';
import { CategoriaRepository } from '../categoria/categoria.repository';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

describe('ProductoService', () => {
  let service: ProductoService;

  beforeEach(() => {
    const productoRepo = new ProductoRepository();
    const marcaRepo = new MarcaRepository();
    const categoriaRepo = new CategoriaRepository();

    marcaRepo.create({ nombre: 'AMD' });
    categoriaRepo.findAll();

    service = new ProductoService(productoRepo, marcaRepo, categoriaRepo);
  });

  it('debería crear un producto válido', async () => {
    const dto: CreateProductoDto = {
      nombre: 'Ryzen 9 7900X',
      descripcion: 'Procesador de alto rendimiento',
      precio: 499,
      imagen: 'https://example.com/ryzen.jpg',
      marcaId: 1,
      categoriaIds: [1, 2],
    };

    const producto = await service.create(dto);
    expect(producto).toHaveProperty('id');
    expect(producto.precio).toBeGreaterThan(0);
    expect(producto.categorias).toHaveLength(2);
    expect(producto.marca.nombre).toBe('AMD');
  });

  it('debería lanzar error si el precio es 0 o negativo', async () => {
    const dto: CreateProductoDto = {
      nombre: 'Ryzen 5',
      precio: 0,
      imagen: 'https://example.com/ryzen.jpg',
      marcaId: 1,
      categoriaIds: [1],
    };

    await expect(service.create(dto)).rejects.toThrow(/precio/i);
  });

  it('debería lanzar error si no hay categorías', async () => {
    const dto: CreateProductoDto = {
      nombre: 'Ryzen 5',
      precio: 200,
      imagen: 'https://example.com/ryzen.jpg',
      marcaId: 1,
      categoriaIds: [],
    };

    await expect(service.create(dto)).rejects.toThrow(/categoría/i);
  });

  it('debería lanzar error si alguna categoría no existe', async () => {
    const dto: CreateProductoDto = {
      nombre: 'Ryzen 5',
      precio: 200,
      imagen: 'https://example.com/ryzen.jpg',
      marcaId: 1,
      categoriaIds: [1, 999],
    };

    await expect(service.create(dto)).rejects.toThrow(/categoría/i);
  });

  it('debería lanzar error si la marca no existe', async () => {
    const dto: CreateProductoDto = {
      nombre: 'Ryzen 5',
      precio: 200,
      imagen: 'https://example.com/ryzen.jpg',
      marcaId: 999,
      categoriaIds: [1],
    };

    await expect(service.create(dto)).rejects.toThrow(/marca/i);
  });

  it('debería actualizar el producto y cambiar categorías', async () => {
    const creado = await service.create({
      nombre: 'Ryzen 5',
      precio: 200,
      imagen: 'https://example.com/ryzen.jpg',
      marcaId: 1,
      categoriaIds: [1],
    });

    const dto: UpdateProductoDto = {
      categoriaIds: [2, 3],
    };

    const actualizado = await service.update(creado.id, dto);
    expect(actualizado.categorias.map(c => c.id)).toEqual([2, 3]);
  });

  it('debería eliminar un producto', async () => {
    const creado = await service.create({
      nombre: 'Ryzen 5',
      precio: 200,
      imagen: 'https://example.com/ryzen.jpg',
      marcaId: 1,
      categoriaIds: [1],
    });

    await service.remove(creado.id);
    const todos = await service.findAll();
    expect(todos).toHaveLength(0);
  });
});
