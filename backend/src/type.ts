export interface Group {
  name: string;
  members: string[];
}

export interface Expense {
  groupName: string;
  expenseName: string;
  payer: string;
  amount: number;
}

export interface Settlement {
  from: string;
  to: string;
  amount: number;
}
