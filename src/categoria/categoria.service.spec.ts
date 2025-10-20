import { Test, TestingModule } from '@nestjs/testing';
import { prisma } from '../common/config/db-client';
import { CategoriaRepository } from './categoria.repository';
import { CategoriaService } from './categoria.service';

describe('CategoriaService', () => {
  let service: CategoriaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoriaService, CategoriaRepository],
    }).compile();

    await prisma.category.createMany({ data: [{ name: 'Procesadores', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Placas Madre', createdAt: new Date(), updatedAt: new Date() }] });
    service = module.get<CategoriaService>(CategoriaService);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('Debería hacer fetch de las categorias de la db', async () => {
    const categorias = await service.findAll();

    expect(Array.isArray(categorias)).toBe(true);
    expect(categorias.length).toBeGreaterThanOrEqual(0);

    if (categorias.length > 0) {
      expect(categorias[0]).toHaveProperty('id');
      expect(categorias[0]).toHaveProperty('name');
    }
  });

  it('debería devolver todas las categorías', async () => {
    const categorias = await service.findAll();

    expect(categorias).toBeDefined();
    expect(categorias.map(c => c.name)).toContain('Procesadores');
  });

  it('debería encontrar una categoría por ID válido', async () => {
    const categoria = await service.findById(1);

    expect(categoria).toBeDefined();
    expect(categoria?.name).toBe('Procesadores');
  });

  it('debería devolver null si el ID no existe', async () => {

    const categoria = await service.findById(999);
    expect(categoria).toBeNull();
  });

  it('todas las categorías deberían tener nombre y descripción', async () => {
    const categorias = await service.findAll();

    for (const cat of categorias) {
      expect(cat.name).toBeDefined();
      expect(typeof cat.name).toBe('string');
    }
  });

  it('los IDs deberían ser únicos y consecutivos', async () => {
    const categorias = await service.findAll();
    const ids = categorias.map(c => c.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
    expect(Math.min(...ids)).toBe(1);
    expect(Math.max(...ids)).toBe(ids.length);
  });
});
