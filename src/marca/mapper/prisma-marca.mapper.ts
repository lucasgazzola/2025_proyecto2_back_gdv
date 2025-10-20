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
            marca.isActive,
        );
    }

    static toPersistence(marca: Marca): any {
        return {
            id: marca.id,
            name: marca.name,
            logo: marca.logo,
            description: marca.description,
            isActive: marca.isActive,
            createdAt: marca.createdAt,
            updatedAt: marca.updatedAt,
        };
    }

    static toCreatePersistence(marca: CreateMarcaDto): any {
        return {
            name: marca.name,
            logo: marca.logo,
            description: marca.description,
            isActive: marca.isActive ?? true,
        };
    }

    static toUpdatePersistence(marca: UpdateMarcaDto): any {
        const data: any = {};
        if (marca.name !== undefined) data.name = marca.name;
        if (marca.logo !== undefined) data.logo = marca.logo;
        if (marca.description !== undefined) data.description = marca.description;
        if (marca.isActive !== undefined) data.isActive = marca.isActive;
        return data;
    }
}