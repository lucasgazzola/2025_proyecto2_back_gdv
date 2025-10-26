import { ProductoService } from './producto.service';
import { validate } from 'class-validator';
import { CreateProductoDto } from './dto/create-producto.dto';

describe('ProductoService - gestión de productos', () => {
  let service: ProductoService;
  const mockRepo: any = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockValidator: any = {
    validarExistencia: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ProductoService(mockRepo, mockValidator);
  });

  it('When (1) name or image empty -> DTO validation messages', async () => {
    const dto = new CreateProductoDto();
    dto.name = '';
    dto.price = 10;
    dto.imageURL = '';
    dto.categoryIds = [1];

    const errors = await validate(dto as any);
    const messages = errors.flatMap((e: any) =>
      e.constraints ? Object.values(e.constraints) : [],
    );

    expect(messages).toContain('El nombre es obligatorio');
    expect(messages).toContain('La imagen es obligatoria');
  });

  it('When (2) price with letters/symbols -> returns "El precio debe ser un número válido"', async () => {
    const dto = new CreateProductoDto();
    dto.name = 'P';
    // @ts-ignore assign invalid type
    dto.price = '12a';
    dto.imageURL = 'img.png';
    dto.categoryIds = [1];

    const errors = await validate(dto as any);
    const messages = errors.flatMap((e: any) =>
      e.constraints ? Object.values(e.constraints) : [],
    );
    expect(messages).toContain('El precio debe ser un número válido');
  });

  it('When (3) search by name or brand not found -> returns empty array', async () => {
    mockRepo.findAll.mockResolvedValue([]);
    await expect(service.findAll()).resolves.toEqual([]);
  });

  it('When (4) valid data -> create or update works and reflects changes', async () => {
    const createDto = new CreateProductoDto();
    createDto.name = 'Prod';
    createDto.price = 100;
    createDto.imageURL = 'img.png';
    createDto.categoryIds = [1];

    const created = { id: 1, name: 'Prod', price: 100 };
    mockRepo.create.mockResolvedValue(created);

    const result = await service.create(createDto as any);
    expect(mockRepo.create).toHaveBeenCalledWith(createDto);
    expect(result).toEqual(created);

    // Update path
    mockValidator.validarExistencia.mockResolvedValue(undefined);
    const updated = { id: 1, name: 'Prod v2', price: 120 };
    mockRepo.update.mockResolvedValue(updated);

    const res2 = await service.update(1, {
      name: 'Prod v2',
      price: 120,
    } as any);
    expect(mockRepo.update).toHaveBeenCalledWith(
      1,
      expect.objectContaining({ name: 'Prod v2' }),
    );
    expect(res2).toEqual(updated);
  });
});
