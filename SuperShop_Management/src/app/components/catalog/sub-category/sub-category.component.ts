import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { SubCategoryService } from '../../../services/sub-category.service';
import { ItemCategoryService } from '../../../services/item-category.service';
import { SubCategory } from '../../../models/sub-category.model';
import { ItemCategory } from '../../../models/item-category.model';

@Component({
  selector: 'app-sub-category',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './sub-category.component.html',
  styleUrls: ['./sub-category.component.css']
})
export class SubCategoryComponent implements OnInit {
  subCategories: SubCategory[] = [];
  categories: ItemCategory[] = [];
  currentSubCategory: SubCategory = this.resetSubCategory();

  isLoading = false;
  isFormVisible = false;
  isEditMode = false;

  // Pagination, Search, and Sort
  p: number = 1;
  pageSize: number = 5;
  searchText = '';
  sortCol: keyof SubCategory | '' = '';
  isAsc = true;

  constructor(
    private subService: SubCategoryService,
    private catService: ItemCategoryService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.subService.getAll().subscribe({
      next: (res) => {
        this.subCategories = res;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => this.isLoading = false
    });
    this.catService.getAll().subscribe((res: any) => this.categories = res);
  }

  // Filtering logic based on SearchText
  get filteredSubCategories() {
    return this.subCategories.filter(s => 
      s.subCategoryName.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  get startIndex(): number {
    return (this.p - 1) * this.pageSize + 1;
  }

  get endIndex(): number {
    return Math.min(this.p * this.pageSize, this.filteredSubCategories.length);
  }

  get totalCount(): number {
    return this.filteredSubCategories.length;
  }

  // Sorting logic for table columns
  sort(col: keyof SubCategory) {
    this.isAsc = this.sortCol === col ? !this.isAsc : true;
    this.sortCol = col;
    this.subCategories.sort((a, b) => {
      const valA = a[col] ?? '';
      const valB = b[col] ?? '';
      return (valA > valB ? 1 : -1) * (this.isAsc ? 1 : -1);
    });
  }

  onSubmit(): void {
    if (!this.currentSubCategory.subCategoryName.trim() || this.currentSubCategory.itemCategoryId === 0) {
      alert('Required fields missing!');
      return;
    }

    const action = this.isEditMode ? 
      this.subService.update(this.currentSubCategory.subCategoryId, this.currentSubCategory) : 
      this.subService.create(this.currentSubCategory);

    action.subscribe({
      next: () => {
        alert(this.isEditMode ? 'Updated successfully!' : 'Saved successfully!');
        this.loadData();
        this.closeForm();
      },
      error: (err) => alert('Operation failed!')
    });
  }

  onEdit(id: number): void {
    this.subService.getById(id).subscribe((res: any) => {
      this.currentSubCategory = { ...res };
      this.isEditMode = true;
      this.isFormVisible = true;
      this.cdr.detectChanges();
    });
  }

  onDelete(id: number): void {
    if (confirm('Delete this sub-category?')) {
      this.subService.delete(id).subscribe(() => this.loadData());
    }
  }

  openForm(): void {
    this.isFormVisible = true;
    this.isEditMode = false;
    this.currentSubCategory = this.resetSubCategory();
  }

  closeForm(): void {
    this.isFormVisible = false;
    this.currentSubCategory = this.resetSubCategory();
  }

  private resetSubCategory(): SubCategory {
    return { 
      subCategoryId: 0, 
      subCategoryName: '', 
      description: '', 
      isActive: true,
      itemCategoryId: 0,
      createdDate: new Date()
    };
  }
}