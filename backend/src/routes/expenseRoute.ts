import express from "express";
import { ExpenseController } from "../controllers/expenseController";

const router = express.Router();

export const expenseRoutes = (
  controller: ExpenseController
): express.Router => {
  router.get("/settlements/:groupName", controller.getSettlements);
  router.post("/expenses", controller.addExpense);

  return router;
};
