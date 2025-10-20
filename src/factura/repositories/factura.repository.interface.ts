import { Factura } from "../factura.entity";

export const IFacturaRepositoryToken = 'IFacturaRepository';

export interface IFacturaRepository {
    findAll(): Promise<Factura[]>;
    findById(id: number): Promise<Factura | null>;
    create(data: any): Promise<Factura>;
    delete(id: number): Promise<Factura>;
}