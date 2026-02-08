import { z } from 'zod';













export const RecipeMediaBaseSchema = z.object({
    user_id: z.string().min(1),
    recipe_id: z.string().min(1),
    media_id: z.string().min(1),
});

export const PostRecipeMediaSchema = RecipeMediaBaseSchema.extend({
    file: z.instanceof(File),
});

export const PostFileClientSchema = RecipeMediaBaseSchema.extend({
    media_url: z.url()
});


export type PostRecipeMediaInput = z.infer<typeof PostRecipeMediaSchema>;
