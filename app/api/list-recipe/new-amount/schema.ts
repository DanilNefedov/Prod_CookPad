import { z } from "zod";

export const PatchNewAmountSchema = z.object({
    connection_id: z.string().min(1),
    ingredient_id: z.string().min(1),
    unit_id: z.string().min(1),
    amount: z.number(),
    _id: z.string().min(1),
}).strict();

export type PatchNewAmountDTO = z.infer<typeof PatchNewAmountSchema>;
