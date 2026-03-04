import { z } from "zod";

export const UnitInputSchema = z.object({
    choice: z.string().min(1),
    amount: z.number(),
    shop_unit: z.boolean(),
}).strict();

export const PatchCookIngredientSchema = z.object({
    connection_id: z.string().min(1),
    name: z.string().min(1),
    units: UnitInputSchema,
}).strict();

export const PostCookIngredientSchema = z.object({
    connection_id: z.string().min(1),
    name: z.string().min(1),
    media: z.string().optional(),
    shop_ingr: z.boolean().optional(),
    units: z.array(UnitInputSchema).optional(),
    list: z.array(z.string()).optional(),
}).strict();

export type PatchCookIngredientDTO = z.infer<typeof PatchCookIngredientSchema>;
export type PostCookIngredientDTO = z.infer<typeof PostCookIngredientSchema>;
