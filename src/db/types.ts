export type PaymentMethod =
  | 'cash'
  | 'bit'
  | 'paybox'
  | 'transfer'
  | 'card'
  | 'check'
  | 'other';

export interface BusinessSettings {
  id: 'settings';
  ownerName: string;
  oseqNumber: string;
  address: string;
  phone: string;
  email: string;
  logoBase64?: string;
  nextReceiptNumber: number;
  annualIncomeLimit: number;
  currentYear: number;
}

export const DEFAULT_SETTINGS: BusinessSettings = {
  id: 'settings',
  ownerName: '',
  oseqNumber: '',
  address: '',
  phone: '',
  email: '',
  nextReceiptNumber: 1,
  annualIncomeLimit: 120000,
  currentYear: new Date().getFullYear(),
};

export interface Receipt {
  id: string;
  receiptNumber: number;
  date: string; // YYYY-MM-DD
  clientName: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  note?: string;
  status: 'saved';
  createdAt: string;
  year: number;
}

export type ReceiptFormData = {
  date: string;
  clientName: string;
  description: string;
  quantity: number;
  unitPrice: number;
  paymentMethod: PaymentMethod;
  note: string;
};

export type Screen =
  | 'main'
  | 'new-receipt'
  | 'report'
  | 'settings'
  | { type: 'view'; id: string };
