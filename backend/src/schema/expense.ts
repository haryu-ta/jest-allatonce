import { z } from "zod";

export const expenseSchema = z
  .object({
    groupName: z.string().min(1, "グループ名は必須です"),
    expenseName: z.string().min(1, "支出名は必須です"),
    payer: z.string().min(1, "支払うメンバーは必須です"),
    amount: z.coerce.number().int().min(1, "金額は1円以上の整数です"),
  })
  .strict();

export type ExpenseSchema = z.infer<typeof expenseSchema>;
