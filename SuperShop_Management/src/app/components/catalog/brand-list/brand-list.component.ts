import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { BrandService } from '../../../services/brand.service';
import { SubCategoryService } from '../../../services/sub-category.service';
import { Brand } from '../../../models/brand.model';

@Component({
  selector: 'app-brand-list',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './brand-list.component.html',
  styleUrls: ['./brand-list.component.css']
})
export class BrandListComponent implements OnInit {
  brands: Brand[] = [];
  subCategories: any[] = [];
  currentBrand: Brand = this.resetBrand();

  isLoading = false;
  isFormVisible = false;
  isEditMode = false;

  // Pagination, Search and Sort
  p: number = 1;
  pageSize: number = 5;
  searchText = '';
  sortCol: keyof Brand | '' = '';
  isAsc = true;

  constructor(
    private brandSvc: BrandService, 
    private subCatSvc: SubCategoryService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() { 
    this.loadData(); 
  }

  loadData() {
    this.isLoading = true;
    this.brandSvc.getAll().subscribe({
      next: (res) => {
        this.brands = res;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => this.isLoading = false
    });
    this.subCatSvc.getAll().subscribe(res => this.subCategories = res);
  }

  get filteredBrands() {
    return this.brands.filter(b => b.brandName.toLowerCase().includes(this.searchText.toLowerCase()));
  }

  sort(col: keyof Brand) {
    this.isAsc = this.sortCol === col ? !this.isAsc : true;
    this.sortCol = col;
    this.brands.sort((a, b) => {
      const valA = a[col] ?? '';
      const valB = b[col] ?? '';
      return (valA > valB ? 1 : -1) * (this.isAsc ? 1 : -1);
    });
  }

  onSubmit() {
    if (!this.currentBrand.brandName || this.currentBrand.subCategoryId === 0) {
      alert('Required fields missing!');
      return;
    }

    const action = this.isEditMode ? 
      this.brandSvc.update(this.currentBrand.brandId, this.currentBrand) : 
      this.brandSvc.create(this.currentBrand);

    action.subscribe({
      next: () => {
        alert(this.isEditMode ? 'Brand updated successfully!' : 'Brand saved successfully!');
        this.loadData(); 
        this.closeForm();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        alert('Error saving brand!');
      }
    });
  }

  onEdit(id: number) {
    this.brandSvc.getById(id).subscribe(res => { 
      this.currentBrand = { ...res }; 
      this.isEditMode = true;
      this.isFormVisible = true; 
      this.cdr.detectChanges();
    });
  }

  onDelete(id: number) {
    if (confirm('Delete this brand?')) {
      this.brandSvc.delete(id).subscribe(() => {
        alert('Deleted successfully!');
        this.loadData();
      });
    }
  }

  openForm() { 
    this.isFormVisible = true; 
    this.isEditMode = false; 
    this.currentBrand = this.resetBrand(); 
    this.cdr.detectChanges();
  }

  closeForm() { 
    this.isFormVisible = false; 
    this.currentBrand = this.resetBrand(); 
    this.cdr.detectChanges();
  }
  
  resetBrand(): Brand {
    return { brandId: 0, brandName: '', country: '', website: '', description: '', isActive: true, subCategoryId: 0 };
  }

  // Pagination info
  get startIndex(): number {
    return (this.p - 1) * this.pageSize + 1;
  }

  get endIndex(): number {
    return Math.min(this.p * this.pageSize, this.filteredBrands.length);
  }

  get totalCount(): number {
    return this.filteredBrands.length;
  }
}