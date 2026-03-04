import { z } from "zod";

export const NewUnitSchema = z.object({
    choice: z.string().min(1),
    amount: z.number(),
    shop_unit: z.boolean(),
}).strict();

export const PatchNewUnitSchema = z.object({
    ingredient_id: z.string().min(1),
    new_unit: NewUnitSchema,
}).strict();

export type PatchNewUnitDTO = z.infer<typeof PatchNewUnitSchema>;
