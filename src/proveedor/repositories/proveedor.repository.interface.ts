
export const IProveedorRepositoryToken = 'IProveedorRepository';

export interface IProveedorRepository {
    findAll(): Promise<any[]>;
    findById(id: number): Promise<any>;
}