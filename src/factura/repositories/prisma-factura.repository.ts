import { CreateFacturaDto } from "../dto/create-factura.dto";
import { Factura } from "../factura.entity";
import { FacturaMapper } from "../mapper/prisma-factura.mapper";
import { IFacturaRepository } from "./factura.repository.interface";
import { prisma } from "src/common/config/db-client";

export class PrismaFacturaRepository implements IFacturaRepository {

    async findAll(): Promise<Factura[]> {
        
        const facturas = await prisma.invoice.findMany({ include: { items: true } });

        return facturas.map(FacturaMapper.toDomain);
    }

    async findById(id: number): Promise<Factura | null> {

        const factura = await prisma.invoice.findUnique({ where: { id }, include: { items: true } });
            
        return FacturaMapper.toDomain(factura);
    }

    async create(dto: any): Promise<Factura> {

        const factura = await prisma.invoice.create({ 
            data: FacturaMapper.toCreatePersistence(dto), 
            include: { items: true } });

        return FacturaMapper.toDomain(factura);
    }

    async delete(id: number): Promise<Factura> {

        const factura = await prisma.invoice.delete({ where: { id }, include: { items: true } });

        return FacturaMapper.toDomain(factura);
    }
}