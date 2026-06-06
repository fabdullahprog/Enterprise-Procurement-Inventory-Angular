import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { CurrencyService } from '../../../services/currency.service';
import { Currency, CurrencyRequest } from '../../../models/currency.model';

@Component({
  selector: 'app-currency',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.css']
})
export class CurrencyComponent implements OnInit {

  currencies: Currency[] = [];
  isFormVisible = false;
  isEditMode = false;
  searchText = '';
  p: number = 1;
  pageSize: number = 10;

  currentCurrency: any = this.resetForm();

  constructor(private currencySvc: CurrencyService) { }

  ngOnInit(): void {
    this.loadCurrencies();
  }

  loadCurrencies(): void {
    this.currencySvc.getAll().subscribe({
      next: (res) => this.currencies = res,
      error: (err) => console.error('Error loading currencies:', err)
    });
  }

  onSubmit(): void {
    const payload: CurrencyRequest = {
      code: this.currentCurrency.code,
      symbol: this.currentCurrency.symbol,
      name: this.currentCurrency.name,
      exchangeRate: Number(this.currentCurrency.exchangeRate),
      isBaseCurrency: this.currentCurrency.isBaseCurrency
    };

    if (this.isEditMode) {
      this.currencySvc.update(this.currentCurrency.currencyId, payload).subscribe({
        next: () => this.handleSuccess('Currency updated successfully!'),
        error: (err) => alert(err.error?.message || 'Update failed')
      });
    } else {
      this.currencySvc.create(payload).subscribe({
        next: () => this.handleSuccess('Currency created successfully!'),
        error: (err) => alert(err.error?.message || 'Creation failed')
      });
    }
  }

  onDelete(id: number): void {
    if (confirm('Are you sure you want to delete this currency?')) {
      this.currencySvc.delete(id).subscribe({
        next: () => this.loadCurrencies(),
        error: (err) => alert('Delete failed')
      });
    }
  }

  openForm(): void {
    this.isFormVisible = true;
    this.isEditMode = false;
    this.currentCurrency = this.resetForm();
  }

  onEdit(item: Currency): void {
    this.isEditMode = true;
    this.isFormVisible = true;
    this.currentCurrency = { ...item };
  }

  closeForm(): void {
    this.isFormVisible = false;
    this.currentCurrency = this.resetForm();
  }

  private handleSuccess(msg: string): void {
    alert(msg);
    this.loadCurrencies();
    this.closeForm();
  }

  private resetForm() {
    return {
      currencyId: 0,
      code: '',
      symbol: '',
      name: '',
      exchangeRate: 1,
      isBaseCurrency: false
    };
  }

  get filteredCurrencies(): Currency[] {
    if (!this.searchText) return this.currencies;
    return this.currencies.filter(c => 
      c.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
      c.code.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  get startIndex(): number {
    return (this.p - 1) * this.pageSize + 1;
  }

  get endIndex(): number {
    return Math.min(this.p * this.pageSize, this.filteredCurrencies.length);
  }

  get totalCount(): number {
    return this.filteredCurrencies.length;
  }
}