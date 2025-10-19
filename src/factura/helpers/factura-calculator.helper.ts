

export class FacturaCalculatorHelper {

    static calcularSubtotal(precio: number, cantidad: number): number {
        return precio * cantidad;
    }

    static calcularTotal(items: Array<{ subtotal: number }>): number {
        
        let total = 0;
        for (const item of items) {
            total += item.subtotal;
        }
        return total;
    }
}
