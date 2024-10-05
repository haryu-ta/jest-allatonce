import { Expense, Settlement } from "../type";

export const calculateSettlements = (
  expenses: Expense[],
  groupMembers: string[]
): Settlement[] => {
  const balance: Record<string, number> = {};
  groupMembers.forEach((member) => {
    balance[member] = 0;
  });

  // 支出をメンバーに分配
  for (const expense of expenses) {
    const amountPerPerson = Math.floor(expense.amount / groupMembers.length);
    const remainder = expense.amount - amountPerPerson * groupMembers.length;
    for (const member of groupMembers) {
      balance[member] -= amountPerPerson;
    }
    // 余りは支払い者が負担
    balance[expense.payer] -= remainder;
    balance[expense.payer] += expense.amount;
  }

  const settlements: Settlement[] = [];

  const debtors = Object.entries(balance).filter(([_, amount]) => amount < 0);
  const creditors = Object.entries(balance).filter(([_, amount]) => amount > 0);

  // 分配した支出から清算リストを作成
  for (let [debtor, debtorAmount] of debtors) {
    while (debtorAmount < 0) {
      for (let i = 0; i < creditors.length; i++) {
        if (creditors[i][1] > 0) {
          const paymentAmount = Math.min(creditors[i][1], -debtorAmount);
          settlements.push({
            from: debtor,
            to: creditors[i][0],
            amount: paymentAmount,
          });
          debtorAmount += paymentAmount;
          creditors[i][1] -= paymentAmount;
          if (debtorAmount === 0) break;
        }
      }
    }
  }

  return settlements;
};
