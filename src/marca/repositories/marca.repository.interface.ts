import { CreateMarcaDto } from "../dto/create-marca.dto";
import { UpdateMarcaDto } from "../dto/update-marca.dto";
import { Marca } from "../marca.entity";


export const IMarcaRepositoryToken = 'IMarcaRepository';

export interface IMarcaRepository {
    create(createMarcaDto: CreateMarcaDto): Promise<Marca>;
    update(id: number, updateMarcaDto: UpdateMarcaDto): Promise<Marca>;
    delete(id: number): Promise<Marca>;
    findAll(): Promise<Marca[]>;
    findById(id: number): Promise<Marca | null>;
    findByName(nombre: string): Promise<Marca | null>;

}