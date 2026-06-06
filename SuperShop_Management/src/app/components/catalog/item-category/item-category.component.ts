import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { ItemCategoryService } from '../../../services/item-category.service';
import { ItemCategory } from '../../../models/item-category.model';

@Component({
  selector: 'app-item-category',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './item-category.component.html',
  styleUrls: ['./item-category.component.css']
})
export class ItemCategoryComponent implements OnInit {
  categories: ItemCategory[] = [];
  currentCategory: ItemCategory = this.resetCategory();

  isLoading = false;
  isFormVisible = false;
  isEditMode = false;

  p: number = 1;
  pageSize: number = 5;
  searchText = '';
  sortCol: keyof ItemCategory | '' = '';
  isAsc = true;

  constructor(
    private categoryService: ItemCategoryService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoading = true;
    this.categoryService.getAll().subscribe({
      next: (res: ItemCategory[]) => {
        this.categories = res;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => this.isLoading = false
    });
  }

  get filteredCategories() {
    return this.categories.filter(c => 
      c.categoryName.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  get startIndex(): number {
    return (this.p - 1) * this.pageSize + 1;
  }

  get endIndex(): number {
    return Math.min(this.p * this.pageSize, this.filteredCategories.length);
  }

  get totalCount(): number {
    return this.filteredCategories.length;
  }

  sort(col: keyof ItemCategory) {
    this.isAsc = this.sortCol === col ? !this.isAsc : true;
    this.sortCol = col;
    this.categories.sort((a, b) => {
      const valA = a[col] ?? '';
      const valB = b[col] ?? '';
      return (valA > valB ? 1 : -1) * (this.isAsc ? 1 : -1);
    });
  }

  onSubmit(): void {
    if (!this.currentCategory.categoryName.trim()) return;

    const action = this.isEditMode ? 
      this.categoryService.update(this.currentCategory.itemCategoryId, this.currentCategory) :
      this.categoryService.create(this.currentCategory);

    action.subscribe({
      next: () => {
        // success message
        alert(this.isEditMode ? 'Category updated successfully!' : 'Category saved successfully!');
        this.loadCategories();
        this.closeForm();
      },
      error: (err) => {
        console.error('Save failed', err);
        alert('Error saving category!');
      }
    });
  }

  onEdit(id: number): void {
    this.categoryService.getById(id).subscribe((res: ItemCategory) => {
      this.currentCategory = { ...res };
      this.isEditMode = true;
      this.isFormVisible = true;
      this.cdr.detectChanges();
    });
  }

  onDelete(id: number): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.delete(id).subscribe(() => {
        alert('Deleted successfully!');
        this.loadCategories();
      });
    }
  }

  openNewForm(): void {
    this.isFormVisible = true;
    this.isEditMode = false;
    this.currentCategory = this.resetCategory();
  }

  closeForm(): void {
    this.isFormVisible = false;
    this.currentCategory = this.resetCategory();
    this.cdr.detectChanges();
  }

  private resetCategory(): ItemCategory {
    return { 
      itemCategoryId: 0, 
      categoryName: '', 
      categoryDescription: '', 
      isActive: true,
      createdDate: new Date()
    };
  }
}