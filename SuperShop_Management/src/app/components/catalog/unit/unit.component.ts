import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { UnitService } from '../../../services/unit.service';
import { Unit } from '../../../models/unit.model';

@Component({
  selector: 'app-unit',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './unit.component.html',
  styleUrls: ['./unit.component.css']
})
export class UnitComponent implements OnInit {
  
  units: Unit[] = [];
  currentUnit: Unit = this.resetUnit();

  isLoading = false;
  isFormVisible = false;
  isEditMode = false;

  // Pagination & Search
  p: number = 1;
  pageSize: number = 5;
  searchText = '';

  constructor(private unitSvc: UnitService) {}

  ngOnInit(): void {
    this.loadUnits();
  }

  loadUnits(): void {
    this.isLoading = true;
    this.unitSvc.getAll().subscribe({
      next: (res: Unit[]) => {
        this.units = res;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error loading units:', err);
        alert('Failed to load units!');
      }
    });
  }

  get filteredUnits(): Unit[] {
    if (!this.searchText) return this.units;
    return this.units.filter(u => 
      u.nameOfUnit.toLowerCase().includes(this.searchText.toLowerCase())
    );
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

  onSubmit(): void {
    if (!this.currentUnit.nameOfUnit || !this.currentUnit.nameOfUnit.trim()) {
      alert('Unit Name is required!');
      return;
    }

    if (this.isEditMode) {
      this.unitSvc.update(this.currentUnit.unitId, this.currentUnit).subscribe({
        next: () => this.handleSuccess('Updated successfully!'),
        error: (err) => alert(err.error?.message || 'Update failed!')
      });
    } else {
      this.unitSvc.create(this.currentUnit).subscribe({
        next: () => this.handleSuccess('Saved successfully!'),
        error: (err) => alert(err.error?.message || 'Save failed!')
      });
    }
  }

  onDelete(id: number): void {
    if (confirm('Are you sure you want to delete this unit?')) {
      this.unitSvc.delete(id).subscribe({
        next: () => {
          alert('Deleted successfully!');
          this.loadUnits();
        },
        error: () => alert('Delete failed!')
      });
    }
  }

  openForm(): void {
    this.isFormVisible = true;
    this.isEditMode = false;
    this.currentUnit = this.resetUnit();
  }

  onEdit(unit: Unit): void {
    this.currentUnit = { ...unit };
    this.isEditMode = true;
    this.isFormVisible = true;
  }

  closeForm(): void {
    this.isFormVisible = false;
    this.isEditMode = false;
    this.currentUnit = this.resetUnit();
  }

  private handleSuccess(msg: string): void {
    alert(msg);
    this.loadUnits();
    this.closeForm();
  }

  private resetUnit(): Unit {
    return { 
      unitId: 0, 
      nameOfUnit: '', 
      unitSetId: 1, 
      unitFactor: 1, 
      isBaseUnit: false, 
      isActive: true,
      description: '',
      remarks: ''
    };
  }
}