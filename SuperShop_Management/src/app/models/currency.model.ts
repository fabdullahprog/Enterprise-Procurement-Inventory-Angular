export interface Currency {
  currencyId: number;
  code: string;
  symbol: string;
  name: string;
  exchangeRate: number;
  isBaseCurrency: boolean;
  isActive: boolean;
  createdDate?: Date;
  createdBy?: string;
}

export interface CurrencyRequest {
  code: string;
  symbol: string;
  name: string;
  exchangeRate: number;
  isBaseCurrency: boolean;
}