import { z } from "zod";

export const groupSchema = z
  .object({
    name: z.string().min(1, "グループ名は必須です"),
    members: z.preprocess(
      (value) => (value as string).split(",").map((v) => v.trim()),
      z
        .array(z.string())
        .min(2, "メンバーは2人以上必要です")
        .refine((value) => value.length === new Set(value).size, {
          message: "メンバー名が重複しています",
        })
    ),
  })
  .strict();

export type GroupSchema = z.infer<typeof groupSchema>;
