import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { SupplierService } from '../../../services/supplier.service';
import { CurrencyService } from '../../../services/currency.service';
import { Supplier, SupplierRequest } from '../../../models/supplier.model';

@Component({
  selector: 'app-supplier',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.css']
})
export class SupplierComponent implements OnInit {
  
  suppliers: Supplier[] = [];
  currencies: any[] = [];
  
  isFormVisible = false;
  isEditMode = false;
  searchText = '';
  p: number = 1;

  currentSupplier: any = this.resetForm();

  constructor(
    private supplierSvc: SupplierService,
    private currencySvc: CurrencyService
  ) {}

  ngOnInit(): void {
    this.loadSuppliers();
    this.loadCurrencies();
  }

  loadSuppliers(): void {
    this.supplierSvc.getAll().subscribe({
      next: (res) => this.suppliers = res,
      error: (err) => console.error('Error loading suppliers:', err)
    });
  }

  loadCurrencies(): void {
    this.currencySvc.getAll().subscribe({
      next: (res) => this.currencies = res.filter((c: any) => c.isActive)
    });
  }

  onSubmit(): void {
    const payload: SupplierRequest = {
      name: this.currentSupplier.name,
      contactPerson: this.currentSupplier.contactPerson,
      phone: this.currentSupplier.phone,
      email: this.currentSupplier.email || null,
      address: this.currentSupplier.address || null,
      tradeLicenseNo: this.currentSupplier.tradeLicenseNo || null,
      tinNo: this.currentSupplier.tinNo || null,
      binNo: this.currentSupplier.binNo || null,
      bankName: this.currentSupplier.bankName || null,
      bankAccountNo: this.currentSupplier.bankAccountNo || null,
     // currencyId: this.currentSupplier.currencyId ? Number(this.currentSupplier.currencyId) : null
    };

    if (this.isEditMode) {
      this.supplierSvc.update(this.currentSupplier.id, payload).subscribe({
        next: () => this.handleSuccess('Supplier updated successfully!'),
        error: (err) => alert(err.error?.message || 'Update failed')
      });
    } else {
      this.supplierSvc.create(payload).subscribe({
        next: () => this.handleSuccess('Supplier created successfully!'),
        error: (err) => alert(err.error?.message || 'Creation failed')
      });
    }
  }

  onDelete(id: number): void {
    if (confirm('Are you sure you want to delete this supplier?')) {
      this.supplierSvc.delete(id).subscribe({
        next: () => this.loadSuppliers(),
        error: (err) => alert('Delete failed')
      });
    }
  }

  openForm(): void {
    this.isFormVisible = true;
    this.isEditMode = false;
    this.currentSupplier = this.resetForm();
  }

  onEdit(item: Supplier): void {
    this.isEditMode = true;
    this.isFormVisible = true;
    this.currentSupplier = { ...item };
  }

  closeForm(): void {
    this.isFormVisible = false;
    this.currentSupplier = this.resetForm();
  }

  private handleSuccess(msg: string): void {
    alert(msg);
    this.loadSuppliers();
    this.closeForm();
  }

  private resetForm() {
    return {
      id: 0,
      name: '',
      contactPerson: '',
      phone: '',
      email: '',
      address: '',
      tradeLicenseNo: '',
      tinNo: '',
      binNo: '',
      bankName: '',
      bankAccountNo: '',
      currencyId: null
    };
  }

  get filteredSuppliers(): Supplier[] {
    if (!this.searchText) return this.suppliers;
    return this.suppliers.filter(s => 
      s.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
      s.phone.includes(this.searchText)
    );
  }
}