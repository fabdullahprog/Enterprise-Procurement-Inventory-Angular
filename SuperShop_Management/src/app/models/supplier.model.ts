export interface Supplier {
  id: number;
  name: string;
  contactPerson: string;
  phone: string;
  email?: string;
  address?: string;
  tradeLicenseNo?: string;
  tinNo?: string;
  binNo?: string;
  bankName?: string;
  bankAccountNo?: string;
  currencyId?: number;
  currencyCode?: string;
  isActive: boolean;
  createdDate?: Date;
  createdBy?: string;
}

export interface SupplierRequest {
  name: string;
  contactPerson: string;
  phone: string;
  email?: string;
  address?: string;
  tradeLicenseNo?: string;
  tinNo?: string;
  binNo?: string;
  bankName?: string;
  bankAccountNo?: string;
  currencyId?: number;
}