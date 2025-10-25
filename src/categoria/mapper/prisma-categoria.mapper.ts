import { Categoria } from '../categoria.entity';

export class CategoriaMapper {
  static toDomain(categoria: any): Categoria {
    return {
      id: categoria.id,
      name: categoria.name,
      description: categoria.description,
      isActive: categoria.isActive,
      createdAt: categoria.createdAt,
      updatedAt: categoria.updatedAt,
    };
  }

  static toPersistence(categoria: any): Categoria {
    return {
      id: categoria.id,
      name: categoria.name,
      createdAt: categoria.createdAt,
      updatedAt: categoria.updatedAt,
    };
  }
}
