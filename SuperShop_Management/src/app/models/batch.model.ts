export interface Batch {
  id: number;
  batchNumber: string;
  manufacturingDate: string;
  expiryDate: string;
  receivedQuantity: number;
  remainingQuantity: number;
  status: string;
  productId: number;
  productName?: string;
  supplierId: number;
  supplierName?: string;
  grnId: number;
  isActive: boolean;
}

export interface BatchCreateDto {
  batchNumber: string;
  manufacturingDate: string;
  expiryDate: string;
  receivedQuantity: number;
  productId: number;
  supplierId: number;
  grnId: number;
}