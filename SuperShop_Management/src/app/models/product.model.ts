export interface Product {
  id: number;
  name: string;
  barcode: string;
  price: number;
  currentStock: number;
  isPerishable: boolean;
  description?: string;
  itemCategoryId: number;
  itemCategoryName?: string;
  subCategoryId: number;
  subCategoryName?: string;
  brandId: number;
  brandName?: string;
  unitId: number;
  unitName?: string;
  isActive: boolean;
}