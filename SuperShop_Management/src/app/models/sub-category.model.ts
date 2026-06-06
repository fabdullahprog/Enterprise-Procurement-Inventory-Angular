export interface SubCategory {
  subCategoryId: number;
  subCategoryName: string;
  description?: string;
  
  itemCategoryId: number;
  itemCategoryName?: string; 
  
  isActive: boolean;
  createdDate: Date;
  createdBy?: string;
  updatedDate?: Date;
  updatedBy?: string;
}


export interface SubCategoryRequest {
  subCategoryName: string;
  description?: string;
  itemCategoryId: number;
}