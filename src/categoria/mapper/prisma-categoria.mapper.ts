import { Categoria } from "../categoria.entity";

export class CategoriaMapper {
    static toDomain(categoria: any): Categoria {
        return new Categoria(
            categoria.id,
            categoria.name,
            categoria.createdAt,
            categoria.updatedAt,

        );
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