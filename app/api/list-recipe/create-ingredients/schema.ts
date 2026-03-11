import { z } from "zod";

export const RecipeIngredientUnitSchema = z.object({
    choice: z.string().optional(),
    amount: z.number().optional(),
    list: z.array(z.string()).optional(),
}).strict();

export const RecipeIngredientItemSchema = z.object({
    name: z.string().optional(),
    media: z.string().optional(),
    units: RecipeIngredientUnitSchema.optional(),
});

export const PatchCreateRecipeIngredientsSchema = z.object({
    connection_id: z.string().min(1),
    recipe_id: z.string().min(1),
    ingredients: z.array(RecipeIngredientItemSchema).min(1),
}).strict();

export type RecipeIngredientItemDTO = z.infer<typeof RecipeIngredientItemSchema>;
export type PatchCreateRecipeIngredientsDTO = z.infer<typeof PatchCreateRecipeIngredientsSchema>;
