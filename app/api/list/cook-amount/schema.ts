import { z } from "zod";

export const PatchCookAmountSchema = z.object({
    name: z.string().min(1),
    connection_id: z.string().min(1),
    _id: z.string().min(1),
    amount: z.number(),
}).strict();

export type PatchCookAmountDTO = z.infer<typeof PatchCookAmountSchema>;
