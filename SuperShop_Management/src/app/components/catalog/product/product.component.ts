import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

import { ProductService } from '../../../services/product.service';
import { ItemCategoryService } from '../../../services/item-category.service';
import { SubCategoryService } from '../../../services/sub-category.service';
import { BrandService } from '../../../services/brand.service';
import { UnitService } from '../../../services/unit.service';

// Model
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  products: Product[] = [];
  itemCategories: any[] = [];
  subCategories: any[] = [];
  filteredSubCategories: any[] = [];
  brands: any[] = [];
  units: any[] = [];

  currentProduct: any = this.resetForm();
  isFormVisible = false;
  isEditMode = false;
  searchText = '';
  p: number = 1;
  pageSize: number = 5;

  constructor(
    private productSvc: ProductService,
    private itemCategorySvc: ItemCategoryService,
    private subCategorySvc: SubCategoryService,
    private brandSvc: BrandService,
    private unitSvc: UnitService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadAllData();
  }

  loadAllData(): void {
    this.productSvc.getAll().subscribe({
      next: (res) => {
        this.products = res;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading products:', err)
    });

    this.itemCategorySvc.getAll().subscribe((res: any) => this.itemCategories = res);
    this.subCategorySvc.getAll().subscribe((res: any) => this.subCategories = res);
    this.brandSvc.getAll().subscribe((res: any) => this.brands = res);
    this.unitSvc.getAll().subscribe((res: any) => this.units = res);
  }

  
  onItemCategoryChange(): void {
    const selectedCatId = Number(this.currentProduct.itemCategoryId);
    
    if (selectedCatId) {
      this.filteredSubCategories = this.subCategories.filter(
        (sub) => Number(sub.itemCategoryId) === selectedCatId
      );
    } else {
      this.filteredSubCategories = [];
    }

    if (!this.isEditMode) {
      this.currentProduct.subCategoryId = '';
    }
  }

  
  onSubmit(): void {
    const payload = {
      ...this.currentProduct,
      itemCategoryId: Number(this.currentProduct.itemCategoryId),
      subCategoryId: Number(this.currentProduct.subCategoryId),
      brandId: Number(this.currentProduct.brandId),
      unitId: Number(this.currentProduct.unitId),
      price: Number(this.currentProduct.price),
      currentStock: Number(this.currentProduct.currentStock)
    };

    if (this.isEditMode) {
      this.productSvc.update(payload.id, payload).subscribe({
        next: () => this.handleSuccess('Product Updated Successfully!'),
        error: (err) => this.handleError(err)
      });
    } else {
      this.productSvc.create(payload).subscribe({
        next: () => this.handleSuccess('Product Created Successfully!'),
        error: (err) => this.handleError(err)
      });
    }
  }

  private handleSuccess(msg: string): void {
    alert(msg);
    this.loadAllData();
    this.closeForm();
  }

  private handleError(error: any): void {
    console.error('Save failed:', error);
    alert('Failed to save! Check if all fields are correct.');
  }

  openForm(): void {
    this.isFormVisible = true;
    this.isEditMode = false;
    this.currentProduct = this.resetForm();
    this.filteredSubCategories = [];
  }

  onEdit(item: any): void {
    this.isEditMode = true;
    this.isFormVisible = true;
    this.currentProduct = { ...item };
    
    this.onItemCategoryChange();
  }

  closeForm(): void {
    this.isFormVisible = false;
    this.isEditMode = false;
  }

  onDelete(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productSvc.delete(id).subscribe(() => this.loadAllData());
    }
  }

  get filteredProducts(): Product[] {
    if (!this.searchText) return this.products;
    return this.products.filter(p => 
      p.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
      p.barcode?.includes(this.searchText)
    );
  }

  get startIndex(): number {
    return (this.p - 1) * this.pageSize + 1;
  }

  get endIndex(): number {
    return Math.min(this.p * this.pageSize, this.filteredProducts.length);
  }

  get totalCount(): number {
    return this.filteredProducts.length;
  }

  private resetForm() {
    return {
      id: 0,
      name: '',
      barcode: '',
      price: 0,
      currentStock: 0,
      isPerishable: false,
      itemCategoryId: '',
      subCategoryId: '',
      brandId: '',
      unitId: ''
    };
  }

  toggleSort(column: string) {
  }
}