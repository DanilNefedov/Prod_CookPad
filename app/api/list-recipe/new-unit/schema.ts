import { z } from "zod";

export const UpdatedUnitSchema = z.object({
    choice: z.string().min(1),
    amount: z.number(),
    shop_unit: z.boolean(),
}).strict();

export const PatchNewUnitSchema = z.object({
    connection_id: z.string().min(1),
    ingredient_id: z.string().min(1),
    updated_unit: UpdatedUnitSchema,
    _id: z.string().min(1),
}).strict();

export type PatchNewUnitDTO = z.infer<typeof PatchNewUnitSchema>;
