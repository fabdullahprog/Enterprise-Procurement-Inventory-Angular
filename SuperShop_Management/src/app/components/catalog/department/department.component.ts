import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { DepartmentService } from '../../../services/department.service';
import { Department } from '../../../models/department.model';

@Component({
  selector: 'app-department',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentComponent implements OnInit {
  departments: Department[] = [];
  filteredDepartments: Department[] = [];
  currentDepartment: Department = {
    departmentId: 0,
    departmentCode: '',
    departmentName: '',
    description: '',
    departmentEmail: '',
    departmentPhone: '',
    location: '',
    canRequestItem: true,
    canIssueItem: true,
    isActive: true,
    createdDate: new Date(),
    createdBy: ''
  };

  searchText: string = '';
  isLoading: boolean = true;
  isFormVisible: boolean = false;
  isEditMode: boolean = false;

  // Pagination & Sort
  p: number = 1;
  pageSize: number = 10;
  sortCol: keyof Department | '' = '';
  isAsc: boolean = true;

  constructor(
    private departmentService: DepartmentService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.isLoading = true;
    this.departmentService.getAll().subscribe({
      next: (data) => {
        this.departments = [...data];
        this.applyFilter();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading departments:', err);
        alert('Failed to load departments!');
        this.isLoading = false;
      }
    });
  }

  applyFilter(): void {
    const search = this.searchText.toLowerCase().trim();
    if (!search) {
      this.filteredDepartments = this.departments;
      return;
    }
    this.filteredDepartments = this.departments.filter(d =>
      d.departmentName.toLowerCase().includes(search) ||
      d.departmentCode.toLowerCase().includes(search) ||
      d.location?.toLowerCase().includes(search) ||
      d.departmentEmail?.toLowerCase().includes(search)
    );
    this.p = 1; // Reset pagination when filtering
  }

  sort(col: keyof Department): void {
    this.isAsc = this.sortCol === col ? !this.isAsc : true;
    this.sortCol = col;
    this.filteredDepartments.sort((a, b) => {
      const valA = a[col] ?? '';
      const valB = b[col] ?? '';
      return (valA > valB ? 1 : -1) * (this.isAsc ? 1 : -1);
    });
  }

  onSubmit(): void {
    if (!this.currentDepartment.departmentName || !this.currentDepartment.departmentCode) {
      alert('Department Name and Code are required!');
      return;
    }

    const payload = {
      departmentCode: this.currentDepartment.departmentCode.trim(),
      departmentName: this.currentDepartment.departmentName.trim(),
      description: this.currentDepartment.description,
      departmentEmail: this.currentDepartment.departmentEmail,
      departmentPhone: this.currentDepartment.departmentPhone,
      location: this.currentDepartment.location,
      canRequestItem: this.currentDepartment.canRequestItem,
      canIssueItem: this.currentDepartment.canIssueItem
    };

    const action = this.isEditMode ?
      this.departmentService.update(this.currentDepartment.departmentId, payload) :
      this.departmentService.create(payload);

    action.subscribe({
      next: () => {
        alert(this.isEditMode ? 'Department updated successfully!' : 'Department created successfully!');
        this.loadDepartments();
        this.closeForm();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error saving department:', err);
        alert('Error saving department!');
      }
    });
  }

  onEdit(id: number): void {
    this.departmentService.getById(id).subscribe({
      next: (data) => {
        this.currentDepartment = { ...data };
        this.isEditMode = true;
        this.isFormVisible = true;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading department:', err);
        alert('Error loading department!');
      }
    });
  }

  onDelete(id: number): void {
    if (confirm('Are you sure you want to delete this department?')) {
      this.departmentService.delete(id).subscribe({
        next: () => {
          alert('Department deleted successfully!');
          this.loadDepartments();
        },
        error: (err) => {
          console.error('Error deleting department:', err);
          alert('Error deleting department!');
        }
      });
    }
  }

  openForm(): void {
    this.isFormVisible = true;
    this.isEditMode = false;
    this.currentDepartment = this.resetDepartment();
    this.cdr.detectChanges();
  }

  closeForm(): void {
    this.isFormVisible = false;
    this.isEditMode = false;
    this.currentDepartment = this.resetDepartment();
    this.cdr.detectChanges();
  }

  private resetDepartment(): Department {
    return {
      departmentId: 0,
      departmentCode: '',
      departmentName: '',
      description: '',
      departmentEmail: '',
      departmentPhone: '',
      location: '',
      canRequestItem: true,
      canIssueItem: true,
      isActive: true,
      createdDate: new Date(),
      createdBy: ''
    };
  }

  // Pagination info
  get startIndex(): number {
    return (this.p - 1) * this.pageSize + 1;
  }

  get endIndex(): number {
    return Math.min(this.p * this.pageSize, this.filteredDepartments.length);
  }

  get totalCount(): number {
    return this.filteredDepartments.length;
  }
}