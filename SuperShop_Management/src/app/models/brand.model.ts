export interface Brand {
    brandId: number;
    brandName: string;
    description?: string;
    country?: string;
    website?: string;
    isActive: boolean;
    subCategoryId: number; // Foreign Key
    subCategory?: {
        subCategoryId: number;
        subCategoryName: string;
    };
}