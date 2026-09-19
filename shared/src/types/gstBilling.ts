export interface Party {
  id?: string;
  name: string;
  mobile: string;
  state: string; // e.g., "Gujarat"
  stateCode?: string; // e.g., "24"
  gstin?: string;
  email?: string;
  address?: string;
}

export interface InvoiceItemLine {
  id: string;
  name: string;
  hsn: string;
  qty: number;
  rate: number;
  gstRate: number; // e.g., 0, 5, 12, 18, 28
  taxableAmount: number;
  cgstRate?: number;
  cgstAmount?: number;
  sgstRate?: number;
  sgstAmount?: number;
  igstRate?: number;
  igstAmount?: number;
  totalAmount: number;
}

export interface BusinessDetails {
  name: string;
  legalName?: string;
  gstin: string;
  address: string;
  state: string;
  stateCode: string;
  phone: string;
  email: string;
}

export interface GSTInvoice {
  id?: string;
  invoiceNo: string;
  invoiceDate: string;
  party: Party;
  items: InvoiceItemLine[];
  subtotal: number;
  isInterState: boolean;
  cgstTotal: number;
  sgstTotal: number;
  igstTotal: number;
  totalTax: number;
  grandTotal: number;
  amountInWords?: string;
  paymentStatus: 'Paid in Full' | 'Partial Balance' | 'Unpaid / Due';
  notes?: string;
}

export const INDIAN_STATES: { name: string; code: string }[] = [
  { name: 'Andhra Pradesh', code: '37' },
  { name: 'Arunachal Pradesh', code: '12' },
  { name: 'Assam', code: '18' },
  { name: 'Bihar', code: '10' },
  { name: 'Chhattisgarh', code: '22' },
  { name: 'Goa', code: '30' },
  { name: 'Gujarat', code: '24' },
  { name: 'Haryana', code: '06' },
  { name: 'Himachal Pradesh', code: '02' },
  { name: 'Jharkhand', code: '20' },
  { name: 'Karnataka', code: '29' },
  { name: 'Kerala', code: '32' },
  { name: 'Madhya Pradesh', code: '23' },
  { name: 'Maharashtra', code: '27' },
  { name: 'Manipur', code: '14' },
  { name: 'Meghalaya', code: '17' },
  { name: 'Mizoram', code: '15' },
  { name: 'Nagaland', code: '13' },
  { name: 'Odisha', code: '21' },
  { name: 'Punjab', code: '03' },
  { name: 'Rajasthan', code: '08' },
  { name: 'Sikkim', code: '11' },
  { name: 'Tamil Nadu', code: '33' },
  { name: 'Telangana', code: '36' },
  { name: 'Tripura', code: '16' },
  { name: 'Uttar Pradesh', code: '09' },
  { name: 'Uttarakhand', code: '05' },
  { name: 'West Bengal', code: '19' },
  { name: 'Delhi', code: '07' },
];

export const GST_SLABS = [0, 5, 12, 18, 28] as const;

export const DEFAULT_BUSINESS: BusinessDetails = {
  name: 'VyaaparGST Retail Enterprises',
  legalName: 'VyaaparGST Solutions Pvt Ltd',
  gstin: '24AAACV1234F1Z5',
  address: 'Shop 14, Commercial Complex, M.G. Road, Rajkot, Gujarat',
  state: 'Gujarat',
  stateCode: '24',
  phone: '+91 98765 43210',
  email: 'billing@vyaapargst.in',
};
