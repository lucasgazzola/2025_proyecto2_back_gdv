export interface IFacturaItemCalculada {
    
    invoiceId: number | undefined;
    productId: number;
    quantity: number;
    providerId: number | undefined;
    unitPrice: number;
    subtotal: number;
}

export interface IFacturaCalculada {

    invoiceNumber: number;
    userId: number;
    items: IFacturaItemCalculada[];
    total: number;
}