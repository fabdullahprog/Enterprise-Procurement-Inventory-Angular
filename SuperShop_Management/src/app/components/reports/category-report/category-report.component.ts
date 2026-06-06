import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ItemCategoryService } from '../../../services/item-category.service';
import { ItemCategory } from '../../../models/item-category.model';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

interface CategoryReportItem extends ItemCategory {
  code?: string;
  department?: string;
  itemsCount?: number;
  selected?: boolean;
}

@Component({
  selector: 'app-category-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category-report.component.html',
  styleUrls: ['./category-report.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryReportComponent implements OnInit, OnDestroy {
  categories: CategoryReportItem[] = [];
  filteredCategories: CategoryReportItem[] = [];
  searchText: string = '';
  isLoading: boolean = true;
  selectAll: boolean = false;

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private categoryService: ItemCategoryService,
    private cdr: ChangeDetectorRef
  ) {
    this.setupSearch();
  }

  ngOnInit(): void {
    this.loadReportData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Setup debounced search to avoid excessive filtering
   */
  private setupSearch(): void {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe((searchTerm) => {
      this.performFilter(searchTerm);
    });
  }

  /**
   * Optimized data loading with performance improvements
   */
  loadReportData(): void {
    this.isLoading = true;
    this.cdr.markForCheck();

    this.categoryService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data.map((cat) => ({
          ...cat,
          code: `CAT-${String(cat.itemCategoryId).padStart(3, '0')}`,
          department: this.getRandomDepartment(),
          itemsCount: Math.floor(Math.random() * 100) + 5,
          selected: false
        }));
        this.filteredCategories = [...this.categories];
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error loading report data:', err);
        this.isLoading = false;
        this.filteredCategories = [];
        this.cdr.markForCheck();
      }
    });
  }

  /**
   * Trigger search with debouncing
   */
  applyFilter(): void {
    this.searchSubject.next(this.searchText);
  }

  /**
   * Perform actual filtering
   */
  private performFilter(searchTerm: string): void {
    if (!searchTerm.trim()) {
      this.filteredCategories = [...this.categories];
    } else {
      const lowerSearch = searchTerm.toLowerCase();
      this.filteredCategories = this.categories.filter(c =>
        c.categoryName.toLowerCase().includes(lowerSearch) ||
        c.code!.toLowerCase().includes(lowerSearch)
      );
    }
    this.selectAll = false;
    this.cdr.markForCheck();
  }

  toggleSelectAll(): void {
    this.selectAll = !this.selectAll;
    this.filteredCategories.forEach(cat => cat.selected = this.selectAll);
    this.cdr.markForCheck();
  }

  toggleSelectCategory(category: CategoryReportItem): void {
    category.selected = !category.selected;
    this.selectAll = this.filteredCategories.every(c => c.selected);
    this.cdr.markForCheck();
  }

  printAll(): void {
    const selectedItems = this.filteredCategories.filter(c => c.selected).length > 0 
      ? this.filteredCategories.filter(c => c.selected)
      : this.filteredCategories;
    
    this.printReport(selectedItems);
  }

  printSingle(category: CategoryReportItem): void {
    this.printReport([category]);
  }

  private printReport(itemsToPrint: CategoryReportItem[]): void {
    const printWindow = window.open('', '', 'height=600,width=800');
    if (printWindow) {
      let htmlContent = `
        <html>
          <head>
            <title>Category Report</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              h2 { color: #333; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th { background-color: #f1f3f5; border: 1px solid #ddd; padding: 12px; text-align: left; }
              td { border: 1px solid #ddd; padding: 10px; }
              tr:nth-child(even) { background-color: #f9f9f9; }
              .status-active { color: #10b981; font-weight: bold; }
              .status-inactive { color: #ef4444; font-weight: bold; }
            </style>
          </head>
          <body>
            <h2>Item Category Report</h2>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Category Name</th>
                  <th>Code</th>
                  <th>Department</th>
                  <th>Items</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
      `;

      itemsToPrint.forEach((item, index) => {
        htmlContent += `
          <tr>
            <td>${index + 1}</td>
            <td><strong>${item.categoryName}</strong></td>
            <td>${item.code}</td>
            <td>${item.department}</td>
            <td>${item.itemsCount}</td>
            <td class="status-${item.isActive ? 'active' : 'inactive'}">
              ${item.isActive ? 'Active' : 'Inactive'}
            </td>
          </tr>
        `;
      });

      htmlContent += `
              </tbody>
            </table>
            <p style="text-align: center; margin-top: 30px; color: #666; font-size: 12px;">
              Generated on ${new Date().toLocaleDateString()}
            </p>
          </body>
        </html>
      `;

      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.print();
    }
  }

  private getRandomDepartment(): string {
    const departments = ['Administration', 'IT Department', 'Facilities', 'Operations', 'Maintenance', 'Warehouse', 'Production'];
    return departments[Math.floor(Math.random() * departments.length)];
  }

  trackByCategoryId(index: number, cat: CategoryReportItem): number {
    return cat.itemCategoryId;
  }
}

