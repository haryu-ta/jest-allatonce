import fs from "fs";
import { Expense } from "../type";

export class ExpenseRepository {
  constructor(private filePath: string) {}
  saveExpense(expense: Expense): void {
    const expenses = this.loadExpenses();
    expenses.push(expense);
    fs.writeFileSync(this.filePath, JSON.stringify(expenses));
  }

  loadExpenses(): Expense[] {
    if (!fs.existsSync(this.filePath)) {
      return [];
    }

    const data = fs.readFileSync(this.filePath, "utf8");
    return JSON.parse(data);
  }
}
