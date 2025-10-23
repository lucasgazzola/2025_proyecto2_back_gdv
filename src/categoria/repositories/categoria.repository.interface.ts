import { Categoria } from '../categoria.entity';
import { CreateCategoriaDto } from '../dto/create-categoria.dto';
import { UpdateCategoriaDto } from '../dto/update-categoria.dto';

export const ICategoriaRepositoryToken = 'ICategoriaRepository';
export interface ICategoriaRepository {
  findAll(): Promise<Categoria[]>;
  findById(id: number): Promise<Categoria | null>;
  findByName(name: string): Promise<Categoria | null>;
  create(categoria: CreateCategoriaDto): Promise<Categoria>;
  update(id: number, categoria: UpdateCategoriaDto): Promise<Categoria>;
  delete(id: number): Promise<void>;
}
