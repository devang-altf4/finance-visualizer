export interface Transaction {
  id: string
  amount: number
  date: Date
  description: string
  category: string
}

export interface Budget {
  category: string;
  amount: number;
}

export interface CategoryBudgetData {
  category: string;
  budget: number;
  actual: number;
}

export interface BudgetComparison {
  categoryName: string;
  budget: number;
  actual: number;
  percentage: number;
}
