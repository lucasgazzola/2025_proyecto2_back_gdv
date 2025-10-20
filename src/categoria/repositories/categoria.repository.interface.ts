import { Categoria } from '../categoria.entity';

export const ICategoriaRepositoryToken = 'ICategoriaRepository';    
export interface ICategoriaRepository {
    findAll(): Promise<Categoria[]>;
    findById(id: number): Promise<Categoria | null>;
}