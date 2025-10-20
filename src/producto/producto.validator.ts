import { Inject, Injectable } from "@nestjs/common";
import type { IProductoRepository } from "./repositories/producto.repository.interface";
import { IProductoRepositoryToken } from "./repositories/producto.repository.interface";

@Injectable()
export class ProductoValidator {
    constructor(
        @Inject(IProductoRepositoryToken)
        private readonly repo: IProductoRepository) {}

    async validarExistencia(id: number): Promise<void> {
        const producto = await this.repo.findById(id);
        if (!producto) {
            throw new Error(`El producto con el id ${id} no existe.`);
        }
    }
}