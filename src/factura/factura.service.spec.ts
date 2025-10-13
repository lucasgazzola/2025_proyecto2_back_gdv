import { FacturaService } from './factura.service';
import { FacturaRepository } from './factura.repository';
import { ProductoRepository } from '../producto/producto.repository';
import { UsuarioRepository } from '../usuario/usuario.repository';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { MarcaRepository } from '../marca/marca.repository';
import { CategoriaRepository } from '../categoria/categoria.repository';
import { Role } from '../common/enums/roles.enums';

describe('FacturaService', () => {
  let service: FacturaService;
  let productoRepo: ProductoRepository;
  let usuarioRepo: UsuarioRepository;
  let marcaRepo: MarcaRepository;

  beforeEach(async () => {
    const facturaRepo = new FacturaRepository();
    productoRepo = new ProductoRepository();
    usuarioRepo = new UsuarioRepository();
    const marcaRepo = new MarcaRepository();
    const categoriaRepo = new CategoriaRepository();

    const marca = await marcaRepo.create({ nombre: 'AMD' })

    const categoria = categoriaRepo.findById(1)!;

    productoRepo.create({
      nombre: 'Ryzen 5',
      precio: 200,
      imagen: 'https://example.com/ryzen5.jpg',
      marca,
      categorias: [categoria],
    });

    productoRepo.create({
      nombre: 'Ryzen 7',
      precio: 300,
      imagen: 'https://example.com/ryzen7.jpg',
      marca,
      categorias: [categoria],
    });

      usuarioRepo.create({ name: 'Gonzalo', lastname: 'Garcia', email: 'gonzalo@example.com', password: 'hashed', role: Role.USER });

    service = new FacturaService(facturaRepo, productoRepo, usuarioRepo);
  });

  it('debería crear una factura válida con múltiples productos', async () => {
    const dto: CreateFacturaDto = {
      usuarioId: 1,
      items: [
        { productoId: 1, cantidad: 2 },
        { productoId: 2, cantidad: 1 },
      ],
    };

    const factura = await service.create(dto);
    expect(factura).toHaveProperty('id');
    expect(factura.items).toHaveLength(2);
    expect(factura.subtotal).toBe(200 * 2 + 300);
    expect(factura.total).toBe(factura.subtotal);
    expect(factura.usuario.id).toBe(1);
  });

  it('debería rechazar si no hay productos', async () => {
    const dto: CreateFacturaDto = {
      usuarioId: 1,
      items: [],
    };

    await expect(service.create(dto)).rejects.toThrow(/al menos un producto/i);
  });

  it('debería rechazar si un producto no existe', async () => {
    const dto: CreateFacturaDto = {
      usuarioId: 1,
      items: [{ productoId: 999, cantidad: 1 }],
    };

    await expect(service.create(dto)).rejects.toThrow(/no encontrado/i);
  });

  it('debería rechazar si el usuario no existe', async () => {
    const dto: CreateFacturaDto = {
      usuarioId: 999,
      items: [{ productoId: 1, cantidad: 1 }],
    };

    await expect(service.create(dto)).rejects.toThrow(/usuario/i);
  });

  it('debería calcular correctamente el total por ítem', async () => {
    const dto: CreateFacturaDto = {
      usuarioId: 1,
      items: [{ productoId: 1, cantidad: 3 }],
    };

    const factura = await service.create(dto);
    expect(factura.items[0].total).toBe(200 * 3);
    expect(factura.subtotal).toBe(200 * 3);
  });

  it('debería asociar correctamente el usuario', async () => {
    const dto: CreateFacturaDto = {
      usuarioId: 1,
      items: [{ productoId: 1, cantidad: 1 }],
    };

    const factura = await service.create(dto);
    expect(factura.usuario.email).toBe('gonzalo@example.com');
  });
});
