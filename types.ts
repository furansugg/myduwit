
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

export enum AccountType {
  BANK = 'BANK',
  EWALLET = 'EWALLET',
  CASH = 'CASH'
}

export type CategoryType = 
  | 'Food' 
  | 'Transport' 
  | 'Leisure' 
  | 'Housing' 
  | 'Shopping' 
  | 'Health'
  | 'Salary' 
  | 'Freelance'
  | 'Gift' 
  | 'Investment'
  | 'Bonus'
  | 'Others';

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  initialBalance: number;
}

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: CategoryType;
  description: string;
  date: string;
  accountId: string;
  createdAt: string;
}

export interface Budget {
  category: string;
  limit: number;
}

export interface SummaryData {
  totalIncome: number;
  totalExpense: number;
  totalBalance: number;
  accountBalances: Record<string, number>;
}

export interface Theme {
  id: string;
  name: string;
  bg: string;
  black: string;
  accent1: string; // Sidebar header
  accent2: string; // Sidebar footer
  cardBg: string;
}
