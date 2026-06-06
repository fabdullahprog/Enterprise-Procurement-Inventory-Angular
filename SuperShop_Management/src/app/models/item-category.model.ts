export interface ItemCategory {
  itemCategoryId: number;
  categoryName: string;
  categoryDescription?: string;
  
  isActive: boolean;
  createdDate: Date;
  createdBy?: string;
  updatedDate?: Date;
  updatedBy?: string;
}


export interface ItemCategoryRequestDto {
  categoryName: string;
  categoryDescription?: string;
}