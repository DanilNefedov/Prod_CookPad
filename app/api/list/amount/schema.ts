import { z } from "zod";

export const PatchAmountSchema = z.object({
    ingredient_id: z.string().min(1),
    unit_id: z.string().min(1),
    amount: z.number(),
}).strict();

export type PatchAmountDTO = z.infer<typeof PatchAmountSchema>;
