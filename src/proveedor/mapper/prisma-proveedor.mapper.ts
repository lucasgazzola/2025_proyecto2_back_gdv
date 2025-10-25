import { CreateProveedorDto } from '../dto/create-proveedor.dto';
import { Proveedor } from '../proveedor.entity';

export class ProveedorMapper {
  static toDomain(proveedor: any): Proveedor {
    return {
      id: proveedor.id,
      name: proveedor.name,
      code: proveedor.code,
      email: proveedor.email,
      phone: proveedor.phone,
      address: proveedor.address,
      city: proveedor.city,
      createdAt: proveedor.createdAt,
      updatedAt: proveedor.updatedAt,
    };
  }

  static toPersistence(proveedor: CreateProveedorDto): any {
    return {
      name: proveedor.name,
      code: proveedor.code,
      email: proveedor.email,
      address: proveedor.address,
      city: proveedor.city,
    };
  }

  static toUpdatePersistence(proveedor: any): any {
    const data: any = {};
    if (proveedor.name !== undefined) data.name = proveedor.name;
    if (proveedor.code !== undefined) data.code = proveedor.code;
    if (proveedor.email !== undefined) data.email = proveedor.email;
    if (proveedor.address !== undefined) data.address = proveedor.address;
    if (proveedor.city !== undefined) data.city = proveedor.city;
    return data;
  }
}
