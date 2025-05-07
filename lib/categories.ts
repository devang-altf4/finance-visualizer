export type Category = {
  id: string;
  name: string;
  color: string;
};

export const categories: Category[] = [
  { id: 'groceries', name: 'Groceries', color: '#4ade80' },
  { id: 'dining', name: 'Dining', color: '#fb923c' },
  { id: 'transportation', name: 'Transportation', color: '#38bdf8' },
  { id: 'utilities', name: 'Utilities', color: '#a78bfa' },
  { id: 'entertainment', name: 'Entertainment', color: '#f87171' },
  { id: 'shopping', name: 'Shopping', color: '#facc15' },
  { id: 'health', name: 'Health', color: '#34d399' },
  { id: 'housing', name: 'Housing', color: '#818cf8' },
  { id: 'travel', name: 'Travel', color: '#f472b6' },
  { id: 'other', name: 'Other', color: '#94a3b8' },
];

export function getCategoryById(id: string): Category {
  return categories.find(category => category.id === id) || categories[categories.length - 1];
}

export function getCategoryColor(categoryId: string): string {
  return getCategoryById(categoryId).color;
}