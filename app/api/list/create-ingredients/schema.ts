import { z } from "zod";

export const CreateIngredientUnitSchema = z.object({
    choice: z.string().optional(),
    amount: z.number().optional(),
    list: z.array(z.string()).optional(),
}).strict();

export const CreateIngredientItemSchema = z.object({
    ingredient_id: z.string().optional(),
    name: z.string().optional(),
    media: z.string().optional(),
    new_ingredient: z.boolean().optional(),
    units: CreateIngredientUnitSchema.optional(),
}).strict();

export const PatchCreateIngredientsSchema = z.object({
    connection_id: z.string().min(1),
    data: z.array(CreateIngredientItemSchema).min(1),
}).strict();

export type CreateIngredientItemDTO = z.infer<typeof CreateIngredientItemSchema>;
