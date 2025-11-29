export enum LoanType {
  PERSONAL = 'Personal Loan',
  MORTGAGE = 'Mortgage',
  AUTO = 'Auto Loan',
  BUSINESS = 'Business Loan'
}

export enum ApplicationStatus {
  DRAFT = 'Draft',
  SUBMITTED = 'Submitted',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  REVIEW = 'Under Review'
}

export interface LoanProduct {
  id: string;
  type: LoanType;
  name: string;
  rate: number;
  minAmount: number;
  maxAmount: number;
  termMonths: number[];
  description: string;
  icon: string;
}

export interface ApplicationFormData {
  // Personal
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  
  // Financial
  employmentStatus: string;
  employerName: string;
  annualIncome: number;
  monthlyDebt: number;
  creditScoreEst: number;
  
  // Loan
  loanType: LoanType;
  amount: number;
  term: number;
  purpose: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface AnalyzedDocumentData {
  employerName?: string;
  period?: string;
  grossPay?: number;
  netPay?: number;
  confidence?: number;
}
