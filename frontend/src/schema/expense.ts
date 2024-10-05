import { z } from "zod";

export const expenseSchema = z
  .object({
    expenseName: z.string().min(1, "支出名は必須です"),
    payer: z.string().min(1, "支払うメンバーは必須です"),
    amount: z.preprocess(
      (v) => Number(v),
      z.number().int().min(1, "金額は1円以上の整数で必須です")
    ),
  })
  .strict();

export type ExpenseSchema = z.infer<typeof expenseSchema>;
