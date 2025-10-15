import { Proveedor } from "../proveedor.entity";


export class ProveedorMapper {

    static toDomain(proveedor: any): Proveedor {
        return {
            id: proveedor.id,
            name: proveedor.name,
            email: proveedor.email,
            phone: proveedor.phone,
            address: proveedor.address,
            createdAt: proveedor.createdAt,
            updatedAt: proveedor.updatedAt,
        };
    }

    static toPersistence(proveedor: Proveedor): any {
        return {
            id: proveedor.id,
            name: proveedor.name,
            email: proveedor.email,
            phone: proveedor.phone,
            address: proveedor.address,
            createdAt: proveedor.createdAt,
            updatedAt: proveedor.updatedAt,
        };
    }
    

}