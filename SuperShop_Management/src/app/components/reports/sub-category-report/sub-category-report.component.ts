import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SubCategoryService } from '../../../services/sub-category.service';
import { SubCategory } from '../../../models/sub-category.model';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

interface SubCategoryReportItem extends SubCategory {
  code?: string;
  itemsCount?: number;
  selected?: boolean;
}

@Component({
  selector: 'app-sub-category-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sub-category-report.component.html',
  styleUrls: ['./sub-category-report.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubCategoryReportComponent implements OnInit, OnDestroy {
  subCategories: SubCategoryReportItem[] = [];
  filteredSubCategories: SubCategoryReportItem[] = [];
  searchText: string = '';
  isLoading: boolean = true;
  selectAll: boolean = false;

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private subCategoryService: SubCategoryService,
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

  private setupSearch(): void {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe((searchTerm) => {
      this.performFilter(searchTerm);
    });
  }

  loadReportData(): void {
    this.isLoading = true;
    this.cdr.markForCheck();

    this.subCategoryService.getAllSubCategories().subscribe({
      next: (data) => {
        this.subCategories = data.map((sub) => ({
          ...sub,
          code: `SUB-${String(sub.subCategoryId).padStart(3, '0')}`,
          itemsCount: Math.floor(Math.random() * 80) + 3,
          selected: false
        }));
        this.filteredSubCategories = [...this.subCategories];
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error loading sub-category report:', err);
        this.isLoading = false;
        this.filteredSubCategories = [];
        this.cdr.markForCheck();
      }
    });
  }

  applyFilter(): void {
    this.searchSubject.next(this.searchText);
  }

  private performFilter(searchTerm: string): void {
    const search = searchTerm.toLowerCase();
    if (!search.trim()) {
      this.filteredSubCategories = [...this.subCategories];
    } else {
      this.filteredSubCategories = this.subCategories.filter(s =>
        s.subCategoryName.toLowerCase().includes(search) || 
        s.code!.toLowerCase().includes(search) ||
        s.itemCategoryName?.toLowerCase().includes(search)
      );
    }
    this.selectAll = false;
    this.cdr.markForCheck();
  }

  toggleSelectAll(): void {
    this.selectAll = !this.selectAll;
    this.filteredSubCategories.forEach(sub => sub.selected = this.selectAll);
    this.cdr.markForCheck();
  }

  toggleSelectSubCategory(subCategory: SubCategoryReportItem): void {
    subCategory.selected = !subCategory.selected;
    this.selectAll = this.filteredSubCategories.every(s => s.selected);
    this.cdr.markForCheck();
  }

  printAll(): void {
    const selectedItems = this.filteredSubCategories.filter(s => s.selected).length > 0 
      ? this.filteredSubCategories.filter(s => s.selected)
      : this.filteredSubCategories;
    
    this.printReport(selectedItems);
  }

  printSingle(subCategory: SubCategoryReportItem): void {
    this.printReport([subCategory]);
  }

  private printReport(itemsToPrint: SubCategoryReportItem[]): void {
    const printWindow = window.open('', '', 'height=600,width=800');
    if (printWindow) {
      let htmlContent = `
        <html>
          <head>
            <title>Sub-Category Report</title>
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
            <h2>Sub-Category Report</h2>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Sub-Category Name</th>
                  <th>Code</th>
                  <th>Category</th>
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
            <td><strong>${item.subCategoryName}</strong></td>
            <td>${item.code}</td>
            <td>${item.itemCategoryName || 'N/A'}</td>
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

  trackBySubCategoryId(index: number, sub: SubCategoryReportItem): number {
    return sub.subCategoryId;
  }
}