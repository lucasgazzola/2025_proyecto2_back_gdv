import { MarcaService } from './marca.service';
import { CreateMarcaDto } from './dto/create-marca.dto';
import { UpdateMarcaDto } from './dto/update-marca.dto';
import { ProductoRepository } from '../producto/producto.repository';
import { CategoriaRepository } from '../categoria/categoria.repository';

describe('MarcaService', () => {
  let service: MarcaService;
  let repo: MarcaRepository;
  let productoRepo: ProductoRepository;
  let categoriaRepo: CategoriaRepository;

  beforeEach(() => {
    repo = new MarcaRepository();
    productoRepo = new ProductoRepository();
    categoriaRepo = new CategoriaRepository();
    service = new MarcaService(repo, productoRepo);
  });

  it('debería crear una marca', async () => {
    const dto: CreateMarcaDto = { nombre: 'Nike', descripcion: 'Marca deportiva' };
    const marca = await service.create(dto);

    expect(marca).toMatchObject({
      id: expect.any(Number),
      nombre: 'Nike',
      descripcion: 'Marca deportiva',
    });
  });

  it('debería listar todas las marcas', async () => {
    await service.create({ nombre: 'Adidas' });
    await service.create({ nombre: 'Puma' });

    const marcas = await service.findAll();
    expect(marcas).toHaveLength(2);
    expect(marcas.map(m => m.nombre)).toEqual(expect.arrayContaining(['Adidas', 'Puma']));
  });

  it('debería encontrar una marca por ID', async () => {
    const creada = await service.create({ nombre: 'Reebok' });
    const encontrada = await service.findOne(creada.id);

    expect(encontrada).toEqual(creada);
  });

  it('debería actualizar una marca', async () => {
    const creada = await service.create({ nombre: 'Fila' });
    const dto: UpdateMarcaDto = { descripcion: 'Actualizada' };

    const actualizada = await service.update(creada.id, dto);
    expect(actualizada.descripcion).toBe('Actualizada');
  });

  it('debería eliminar una marca', async () => {
    const creada = await service.create({ nombre: 'Umbro' });
    await service.remove(creada.id);

    const todas = await service.findAll();
    expect(todas).toHaveLength(0);
  });

  it('debería lanzar error si la marca no existe', async () => {
    await expect(service.findOne(999)).resolves.toBeNull();
    await expect(service.update(999, { nombre: 'X' })).rejects.toThrow('Marca no encontrada');
    await expect(service.remove(999)).rejects.toThrow('Marca no encontrada');
  });

  it('no debería permitir crear marcas con el mismo nombre', async () => {
  await service.create({ nombre: 'Nike' });

  await expect(service.create({ nombre: 'nike' })).rejects.toThrow("Marca ya existente");
});

  it('debería bloquear la eliminación si hay productos asociados', async () => {
    const marca = await repo.create({ nombre: 'Intel' });
    await productoRepo.create({
      nombre: 'Core i9',
      precio: 600,
      imagen: 'https://...',
      marca,
      categorias: [],
    });

  await expect(service.remove(marca.id)).rejects.toThrow("No se puede eliminar la marca, ya tiene productos asoaciados");
});

});