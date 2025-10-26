export interface IFacturaItemCalculada {
  invoiceId: number | undefined;
  productId: number;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface IFacturaCalculada {
  invoiceNumber: number;
  userId: number;
  customerId?: number;
  items: IFacturaItemCalculada[];
  total: number;
}
