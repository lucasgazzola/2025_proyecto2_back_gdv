import { CategoriaRepository } from './categoria.repository';
import { CategoriaService } from './categoria.service';

describe('CategoriaService', () => {
  let service: CategoriaService;
  let repo: CategoriaRepository;

  beforeEach(() => {
    repo = new CategoriaRepository();
    service = new CategoriaService(repo);
  });

  it('debería devolver todas las categorías', () => {
    const categorias = service.findAll();
    expect(categorias).toBeDefined();
    expect(categorias.length).toBeGreaterThan(0);
    expect(categorias.map(c => c.nombre)).toContain('Procesadores');
  });

  it('debería encontrar una categoría por ID válido', () => {
    const categoria = service.findById(1);
    expect(categoria).toBeDefined();
    expect(categoria?.nombre).toBe('Procesadores');
  });

  it('debería devolver null si el ID no existe', () => {
    const categoria = service.findById(999);
    expect(categoria).toBeNull();
  });

  it('todas las categorías deberían tener nombre y descripción', () => {
    const categorias = service.findAll();
    for (const cat of categorias) {
      expect(cat.nombre).toBeDefined();
      expect(typeof cat.nombre).toBe('string');
      expect(cat.descripcion).toBeDefined();
    }
  });

  it('los IDs deberían ser únicos y consecutivos', () => {
    const categorias = service.findAll();
    const ids = categorias.map(c => c.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
    expect(Math.min(...ids)).toBe(1);
    expect(Math.max(...ids)).toBe(ids.length);
  });
});
