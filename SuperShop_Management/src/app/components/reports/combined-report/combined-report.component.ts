import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ItemCategoryService } from '../../../services/item-category.service';
import { SubCategoryService } from '../../../services/sub-category.service';
import { ItemCategory } from '../../../models/item-category.model';
import { SubCategory } from '../../../models/sub-category.model';
import { Subject, debounceTime, distinctUntilChanged, takeUntil, forkJoin } from 'rxjs';

interface CategoryReportItem extends ItemCategory {
  code?: string;
  department?: string;
  itemsCount?: number;
  selected?: boolean;
}

interface SubCategoryReportItem extends SubCategory {
  code?: string;
  itemsCount?: number;
  selected?: boolean;
}

@Component({
  selector: 'app-combined-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './combined-report.component.html',
  styleUrls: ['./combined-report.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CombinedReportComponent implements OnInit, OnDestroy {
  // Active tab: 'category' or 'subcategory'
  activeTab: 'category' | 'subcategory' = 'category';

  // Category data
  categories: CategoryReportItem[] = [];
  filteredCategories: CategoryReportItem[] = [];
  categorySearchText: string = '';
  categorySelectAll: boolean = false;

  // Sub-Category data
  subCategories: SubCategoryReportItem[] = [];
  filteredSubCategories: SubCategoryReportItem[] = [];
  subCategorySearchText: string = '';
  subCategorySelectAll: boolean = false;

  isLoading: boolean = true;

  private categorySearchSubject = new Subject<string>();
  private subCategorySearchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private categoryService: ItemCategoryService,
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

  /**
   * Setup debounced search for both tabs
   */
  private setupSearch(): void {
    this.categorySearchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe((searchTerm) => {
      this.performCategoryFilter(searchTerm);
    });

    this.subCategorySearchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe((searchTerm) => {
      this.performSubCategoryFilter(searchTerm);
    });
  }

  /**
   * Load both category and sub-category data simultaneously
   */
  loadReportData(): void {
    this.isLoading = true;
    this.cdr.markForCheck();

    forkJoin({
      categories: this.categoryService.getAllCategories(),
      subCategories: this.subCategoryService.getAllSubCategories()
    }).subscribe({
      next: ({ categories, subCategories }) => {
        this.categories = categories.map((cat) => ({
          ...cat,
          code: `CAT-${String(cat.itemCategoryId).padStart(3, '0')}`,
          department: this.getRandomDepartment(),
          itemsCount: Math.floor(Math.random() * 100) + 5,
          selected: false
        }));
        this.filteredCategories = [...this.categories];

        this.subCategories = subCategories.map((sub) => ({
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
        console.error('Error loading report data:', err);
        this.isLoading = false;
        this.filteredCategories = [];
        this.filteredSubCategories = [];
        this.cdr.markForCheck();
      }
    });
  }

  // ===================== TAB SWITCHING =====================
  switchTab(tab: 'category' | 'subcategory'): void {
    this.activeTab = tab;
    this.cdr.markForCheck();
  }

  // ===================== CATEGORY METHODS =====================
  applyCategoryFilter(): void {
    this.categorySearchSubject.next(this.categorySearchText);
  }

  private performCategoryFilter(searchTerm: string): void {
    if (!searchTerm.trim()) {
      this.filteredCategories = [...this.categories];
    } else {
      const lowerSearch = searchTerm.toLowerCase();
      this.filteredCategories = this.categories.filter(c =>
        c.categoryName.toLowerCase().includes(lowerSearch) ||
        c.code!.toLowerCase().includes(lowerSearch)
      );
    }
    this.categorySelectAll = false;
    this.cdr.markForCheck();
  }

  toggleCategorySelectAll(): void {
    this.categorySelectAll = !this.categorySelectAll;
    this.filteredCategories.forEach(cat => cat.selected = this.categorySelectAll);
    this.cdr.markForCheck();
  }

  toggleSelectCategory(category: CategoryReportItem): void {
    category.selected = !category.selected;
    this.categorySelectAll = this.filteredCategories.every(c => c.selected);
    this.cdr.markForCheck();
  }

  /**
   * Print All: Generates a combined hierarchical report
   * Each category is shown as a section with its sub-categories nested below
   */
  printAllCategories(): void {
    const selectedCategories = this.filteredCategories.filter(c => c.selected).length > 0
      ? this.filteredCategories.filter(c => c.selected)
      : this.filteredCategories;
    this.printCombinedReport(selectedCategories);
  }

  printSingleCategory(category: CategoryReportItem): void {
    this.printCombinedReport([category]);
  }

  /**
   * Combined hierarchical print: Category → its Sub-Categories
   */
  private printCombinedReport(categoriesToPrint: CategoryReportItem[]): void {
    const printWindow = window.open('', '', 'height=800,width=1000');
    if (!printWindow) return;

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    let sectionsHtml = '';

    categoriesToPrint.forEach((cat, catIndex) => {
      // Find sub-categories belonging to this category
      const relatedSubs = this.subCategories.filter(
        sub => sub.itemCategoryId === cat.itemCategoryId
      );

      // Sub-category rows
      let subRows = '';
      if (relatedSubs.length > 0) {
        relatedSubs.forEach((sub, subIndex) => {
          subRows += `
            <tr>
              <td style="text-align: center; color: #64748b;">${subIndex + 1}</td>
              <td>${sub.subCategoryName}</td>
              <td style="text-align: center;">
                <span style="background: #f1f5f9; padding: 2px 8px; border-radius: 4px; font-size: 11px; color: #475569;">${sub.code}</span>
              </td>
              <td style="text-align: center;">${sub.itemsCount}</td>
              <td style="text-align: center;">
                <span style="color: ${sub.isActive ? '#059669' : '#dc2626'}; font-weight: 600; font-size: 12px;">
                  ${sub.isActive ? 'Active' : 'Inactive'}
                </span>
              </td>
            </tr>
          `;
        });
      } else {
        subRows = `
          <tr>
            <td colspan="5" style="text-align: center; color: #94a3b8; font-style: italic; padding: 12px;">
              No sub-categories found
            </td>
          </tr>
        `;
      }

      sectionsHtml += `
        <!-- Category Section -->
        <div style="margin-bottom: 28px; page-break-inside: avoid;">
          <!-- Category Header -->
          <div style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); border-radius: 8px 8px 0 0; padding: 14px 20px; display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <span style="background: rgba(255,255,255,0.15); color: #fff; width: 32px; height: 32px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px;">${catIndex + 1}</span>
              <div>
                <div style="color: #fff; font-size: 16px; font-weight: 700;">${cat.categoryName}</div>
                <div style="color: #94a3b8; font-size: 12px; margin-top: 2px;">${cat.code} &bull; ${cat.department}</div>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 16px;">
              <div style="text-align: center;">
                <div style="color: #94a3b8; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px;">Items</div>
                <div style="color: #fff; font-size: 18px; font-weight: 700;">${cat.itemsCount}</div>
              </div>
              <div style="text-align: center;">
                <div style="color: #94a3b8; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px;">Sub-Categories</div>
                <div style="color: #fff; font-size: 18px; font-weight: 700;">${relatedSubs.length}</div>
              </div>
              <span style="background: ${cat.isActive ? '#059669' : '#dc2626'}; color: #fff; padding: 4px 14px; border-radius: 99px; font-size: 12px; font-weight: 600;">
                ${cat.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>

          <!-- Sub-Categories Table -->
          <table style="width: 100%; border-collapse: collapse; border: 1px solid #e2e8f0; border-top: none;">
            <thead>
              <tr style="background: #f8fafc;">
                <th style="padding: 10px 12px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; font-weight: 600; border-bottom: 2px solid #e2e8f0; text-align: center; width: 50px;">#</th>
                <th style="padding: 10px 12px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; font-weight: 600; border-bottom: 2px solid #e2e8f0; text-align: left;">Sub-Category Name</th>
                <th style="padding: 10px 12px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; font-weight: 600; border-bottom: 2px solid #e2e8f0; text-align: center;">Code</th>
                <th style="padding: 10px 12px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; font-weight: 600; border-bottom: 2px solid #e2e8f0; text-align: center; width: 80px;">Items</th>
                <th style="padding: 10px 12px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; font-weight: 600; border-bottom: 2px solid #e2e8f0; text-align: center; width: 80px;">Status</th>
              </tr>
            </thead>
            <tbody>
              ${subRows}
            </tbody>
          </table>
        </div>
      `;
    });

    const totalCategories = categoriesToPrint.length;
    const totalSubCategories = categoriesToPrint.reduce((sum, cat) => {
      return sum + this.subCategories.filter(s => s.itemCategoryId === cat.itemCategoryId).length;
    }, 0);

    const htmlContent = `
      <html>
        <head>
          <title>Category & Sub-Category Report</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 30px; color: #1e293b; background: #fff; }
            table td { padding: 10px 12px; border-bottom: 1px solid #f1f5f9; font-size: 13px; color: #334155; }
            table tr:hover { background: #f8fafc; }
            @media print {
              body { padding: 15px; }
              div[style*="page-break-inside"] { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <!-- Report Header -->
          <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #e2e8f0;">
            <h1 style="font-size: 22px; font-weight: 700; color: #1e293b; margin-bottom: 4px;">Category & Sub-Category Report</h1>
            <p style="color: #64748b; font-size: 13px;">SuperShop Management System</p>
            <div style="display: flex; justify-content: center; gap: 24px; margin-top: 14px;">
              <span style="background: #eff6ff; color: #2563eb; padding: 6px 16px; border-radius: 99px; font-size: 12px; font-weight: 600;">
                📂 Categories: ${totalCategories}
              </span>
              <span style="background: #f0fdf4; color: #059669; padding: 6px 16px; border-radius: 99px; font-size: 12px; font-weight: 600;">
                📁 Sub-Categories: ${totalSubCategories}
              </span>
              <span style="background: #f8fafc; color: #64748b; padding: 6px 16px; border-radius: 99px; font-size: 12px; font-weight: 600;">
                🕐 ${dateStr}, ${timeStr}
              </span>
            </div>
          </div>

          <!-- Category Sections -->
          ${sectionsHtml}

          <!-- Footer -->
          <div style="text-align: center; margin-top: 30px; padding-top: 16px; border-top: 1px solid #e2e8f0;">
            <p style="color: #94a3b8; font-size: 11px;">Generated on ${dateStr} at ${timeStr} &bull; SuperShop Management System</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.print();
  }

  // ===================== SUB-CATEGORY METHODS =====================
  applySubCategoryFilter(): void {
    this.subCategorySearchSubject.next(this.subCategorySearchText);
  }

  private performSubCategoryFilter(searchTerm: string): void {
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
    this.subCategorySelectAll = false;
    this.cdr.markForCheck();
  }

  toggleSubCategorySelectAll(): void {
    this.subCategorySelectAll = !this.subCategorySelectAll;
    this.filteredSubCategories.forEach(sub => sub.selected = this.subCategorySelectAll);
    this.cdr.markForCheck();
  }

  toggleSelectSubCategory(subCategory: SubCategoryReportItem): void {
    subCategory.selected = !subCategory.selected;
    this.subCategorySelectAll = this.filteredSubCategories.every(s => s.selected);
    this.cdr.markForCheck();
  }

  /**
   * Print All Sub-Categories: Also generates hierarchical report grouped by parent category
   */
  printAllSubCategories(): void {
    const selectedSubs = this.filteredSubCategories.filter(s => s.selected).length > 0
      ? this.filteredSubCategories.filter(s => s.selected)
      : this.filteredSubCategories;

    // Group selected sub-categories by their parent category, then print combined
    const parentCategoryIds = [...new Set(selectedSubs.map(s => s.itemCategoryId))];
    const relevantCategories = this.categories.filter(c => parentCategoryIds.includes(c.itemCategoryId));
    this.printCombinedReport(relevantCategories);
  }

  printSingleSubCategory(subCategory: SubCategoryReportItem): void {
    // Find the parent category and print just that section
    const parentCat = this.categories.find(c => c.itemCategoryId === subCategory.itemCategoryId);
    if (parentCat) {
      this.printCombinedReport([parentCat]);
    }
  }

  // ===================== HELPERS =====================
  private getRandomDepartment(): string {
    const departments = ['Administration', 'IT Department', 'Facilities', 'Operations', 'Maintenance', 'Warehouse', 'Production'];
    return departments[Math.floor(Math.random() * departments.length)];
  }

  trackByCategoryId(index: number, cat: CategoryReportItem): number {
    return cat.itemCategoryId;
  }

  trackBySubCategoryId(index: number, sub: SubCategoryReportItem): number {
    return sub.subCategoryId;
  }
}
