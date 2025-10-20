
export const IUsuarioRepositoryToken = 'IUsuarioRepository';


export interface IUsuarioRepository {
    findAll(): Promise<any[]>;
    findById(id: number): Promise<any>;
    findByEmail(email: string): Promise<any>;
    findByEmailWithPassword(email: string): Promise<any>;
    create(data: any): Promise<any>;
    update(id: number, data: any): Promise<any>;
    delete(id: number): Promise<any>;
}
