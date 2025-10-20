import { BadRequestException } from "@nestjs/common";
import { Producto } from "src/producto/producto.entity";


export class FacturaValidatorHelper {

    static validarCantidad(cantidadProductos: number): void {
        if (cantidadProductos <= 0) {
            throw new BadRequestException('La cantidad de productos debe ser mayor a 0');
        }
    }

    static validarPrecio(precio: number): void {
        if (precio <= 0) {
            throw new BadRequestException('El precio debe ser mayor a 0');
        }

        if (isNaN(precio)) {
            throw new BadRequestException('El precio debe ser un número');
        }
    }

    static validarStock(stock: number, pedido: number, nombreProducto: string): void {
        if (pedido > stock) {
            throw new BadRequestException(
                'Stock insuficiente para el producto. ' + nombreProducto + 'Disponible: ${stock}, Solicitado: ${pedido}');
        }
    }

    static validarItems(items: any[]): void {
        if (!items || items.length === 0) {
            throw new BadRequestException('La factura debe tener al menos un producto');
        }
    }
}