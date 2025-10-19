import { Marca } from "src/marca/marca.entity";
import { CreateMarcaDto } from "../dto/create-marca.dto";
import { UpdateMarcaDto } from "../dto/update-marca.dto";


export class MarcaMapper {
    static toDomain(marca: any): Marca {
        return new Marca(
            marca.id,
            marca.name,
            marca.createdAt,
            marca.updatedAt,
            marca.logo,
            marca.description,
        );
    }

    static toPersistence(marca: Marca): any {
        return {
            id: marca.id,
            name: marca.name,
            logo: marca.logo,
            description: marca.description,
            createdAt: marca.createdAt,
            updatedAt: marca.updatedAt,
        };
    }

    static toCreatePersistence(marca: CreateMarcaDto): any {
        return {
            name: marca.name,
            logo: marca.logo,
            description: marca.description,
        };
    }

    static toUpdatePersistence(marca: UpdateMarcaDto): any {
        return {
            name: marca.name,
            logo: marca.logo,
            description: marca.description,
        };
    }
}