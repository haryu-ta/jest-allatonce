import express from "express";
import { ExpenseService } from "../services/expenseService";
import { Expense } from "../type";
import { expenseSchema } from "../schema/expense";
import { ZodError } from "zod";

export class ExpenseController {
  constructor(private expenseService: ExpenseService) {}

  getSettlements = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const settlements = this.expenseService.getSettlements(
        req.params.groupName as string
      );
      res.status(200).json(settlements);
    } catch (e) {
      next(e);
    }
  };

  addExpense = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    let validatedInput: Expense;
    try {
      validatedInput = expenseSchema.parse(req.body);
      const { groupName, expenseName, payer, amount } = validatedInput;
      this.expenseService.addExpense({
        groupName,
        expenseName,
        payer,
        amount: amount,
      });
      res.status(200).send("支出が登録されました");
    } catch (e) {
      if (e instanceof ZodError) {
        const errorMessages = e.issues.map((e) => e.message);
        return res.status(400).send(errorMessages);
      }
      next(e);
    }
  };
}
