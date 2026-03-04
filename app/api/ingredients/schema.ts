import { z } from 'zod';




//PATCH

export const PatchIngredientSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, 'Name is required')
        .max(50),

    unit: z.string().trim().min(1).max(15),

    new_ingredient: z.boolean(),
}).strict();

export const PatchIngredientsArraySchema = z.array(PatchIngredientSchema);

export const PatchIngredientsBodySchema = z.object({
    updated: z.number(),
    newIngredients: z.array(z.string()),
}).strict();

export const PatchIngredientsSuccessSchema = z.object({
    message: z.literal("Success"),
    body: PatchIngredientsBodySchema,
}).strict();

export const PatchIngredientsErrorSchema = z.object({
    message: z.string(),
    code: z.number(),
}).strict();

export type PatchIngredientInput = z.infer<typeof PatchIngredientSchema>;
// export type PatchIngredientApiSuccess = z.infer<typeof PatchIngredientsSuccessSchema>;
// export type PatchIngredientApiError = z.infer<typeof PatchIngredientsErrorSchema>;

//PATCH




//POST 

export const PostIngredientsSchema = z.array(
    z.string().trim().min(1, 'Ingredient name is required').max(50)
)
    .min(1, 'At least one ingredient is required');

export type PostIngredientsInput = z.infer<typeof PostIngredientsSchema>;

//POST







//GET

export const GetIngredientsQuerySchema = z.object({
    input: z.string().trim().min(1, 'Ingredient name is required').max(50),
});

export type GetIngredientsQuery = z.infer<typeof GetIngredientsQuerySchema>;

//GET