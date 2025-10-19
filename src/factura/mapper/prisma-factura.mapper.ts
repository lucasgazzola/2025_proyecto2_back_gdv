import { UsuarioMapper } from "src/usuario/mapper/prisma-usuario.mapper";
import { ProductoMapper } from "src/producto/mapper/prisma-producto.mapper";
import { CreateFacturaDto, CreateFacturaItemDto } from "../dto/create-factura.dto";
import { IFacturaCalculada, IFacturaItemCalculada } from "../factura-calculada.interface";

export class FacturaItemMapper {

    static toDomain(facturaItem: any) {
        return {
            id: facturaItem.id,
            invoiceId: facturaItem.invoiceId,
            productId: facturaItem.productId,
            product: facturaItem.product ? ProductoMapper.toDomain(facturaItem.product) : undefined,
            quantity: facturaItem.quantity,
            unitPrice: facturaItem.unitPrice,
            subtotal: facturaItem.subtotal,
        };
    }

    static toCreatePersistence(facturaItem: IFacturaItemCalculada) {
        return {
            product:  { connect: {id: facturaItem.productId} },
            provider: { connect: {id: facturaItem.providerId} },
            quantity: facturaItem.quantity,
            unitPrice: facturaItem.unitPrice,
            subtotal: facturaItem.subtotal,
        };
    }

}

export class FacturaMapper {

    static toDomain(factura: any) {
        return {
            id: factura.id,
            invoiceNumber: factura.invoiceNumber,
            userId: factura.userId,
            user: factura.user ? UsuarioMapper.toDomain(factura.user) : undefined,
            items: factura.items ? factura.items.map(item => FacturaItemMapper.toDomain(item)) : [],
            total: factura.total,
            createdAt: factura.createdAt,
            updatedAt: factura.updatedAt,
        };
    }

    static toCreatePersistence(data: IFacturaCalculada): any {
        return {
            invoiceNumber: String(data.invoiceNumber),
            user: data.userId ? { connect: {id: data.userId} } : undefined,
            items: { 
            create: data.items.map(item => FacturaItemMapper.toCreatePersistence(item)),
            },
            total: data.total,
        };
    }
}