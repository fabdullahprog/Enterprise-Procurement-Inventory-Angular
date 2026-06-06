import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { UnitService } from '../../../services/unit.service';
import { UnitSetService } from '../../../services/unit-set.service';
import { Unit } from '../../../models/unit.model';
import { UnitSet } from '../../../models/unit-set.model';

@Component({
  selector: 'app-unit',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './unit-set.component.html', // Make sure this is unit.component.html
  styleUrls: ['./unit-set.component.css']
})
export class UnitSetComponent implements OnInit {
  units: Unit[] = [];
  unitSets: UnitSet[] = [];
  currentUnit: any = this.resetForm();
  
  isFormVisible = false;
  isEditMode = false;
  searchText = '';
  p: number = 1;
  pageSize: number = 5;

  sortColumn: string = 'unitId';
  sortDirection: boolean = false;

  constructor(
    private unitSvc: UnitService,
    private unitSetSvc: UnitSetService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.loadUnitSets();
  }

  loadData(): void {
    this.unitSvc.getAll().subscribe({
      next: (res) => {
        this.units = res;
        this.applySort();
        this.cdr.detectChanges();
      },
      error: () => alert('Failed to load units!')
    });
  }

  loadUnitSets(): void {
    this.unitSetSvc.getAll().subscribe(res => this.unitSets = res);
  }

  onSubmit(): void {
    const payload = {
      nameOfUnit: this.currentUnit.nameOfUnit,
      unitSetId: Number(this.currentUnit.unitSetId),
      unitFactor: Number(this.currentUnit.unitFactor),
      isBaseUnit: this.currentUnit.isBaseUnit,
      description: this.currentUnit.description,
      remarks: this.currentUnit.remarks
    };

    if (this.isEditMode) {
      this.unitSvc.update(this.currentUnit.unitId, payload).subscribe({
        next: () => this.handleSuccess('Updated successfully!'),
        error: (err) => alert(err.error?.message || 'Update failed!')
      });
    } else {
      this.unitSvc.create(payload).subscribe({
        next: () => this.handleSuccess('Saved successfully!'),
        error: (err) => alert(err.error?.message || 'Save failed!')
      });
    }
  }

  private handleSuccess(msg: string): void {
    alert(msg);
    this.loadData();
    this.closeForm();
  }

  onEdit(item: Unit): void {
    this.currentUnit = { ...item };
    this.isEditMode = true;
    this.isFormVisible = true;
  }

  onDelete(id: number): void {
    if (confirm('Are you sure?')) {
      this.unitSvc.delete(id).subscribe({
        next: () => this.loadData(),
        error: () => alert('Delete failed! Check permissions.')
      });
    }
  }

  // Sorting
  toggleSort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = !this.sortDirection;
    } else {
      this.sortColumn = column;
      this.sortDirection = false;
    }
    this.applySort();
  }

  applySort(): void {
    this.units.sort((a: any, b: any) => {
      const valA = a[this.sortColumn];
      const valB = b[this.sortColumn];
      return this.sortDirection ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
    });
  }

  get filteredUnits() {
    return this.units.filter(u => u.nameOfUnit.toLowerCase().includes(this.searchText.toLowerCase()));
  }

  get startIndex(): number {
    return (this.p - 1) * this.pageSize + 1;
  }

  get endIndex(): number {
    return Math.min(this.p * this.pageSize, this.filteredUnits.length);
  }

  get totalCount(): number {
    return this.filteredUnits.length;
  }

  openForm(): void { this.isFormVisible = true; this.isEditMode = false; this.currentUnit = this.resetForm(); }
  closeForm(): void { this.isFormVisible = false; }
  private resetForm() { return { unitId: 0, nameOfUnit: '', unitSetId: '', unitFactor: 1, isBaseUnit: false }; }
}