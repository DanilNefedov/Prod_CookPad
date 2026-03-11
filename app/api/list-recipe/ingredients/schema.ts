import { z } from "zod";

export const GetListRecipeIngredientsQuerySchema = z.object({
    connection_id: z.string().min(1),
    _id: z.string().min(1),
});

export type GetListRecipeIngredientsQueryDTO = z.infer<typeof GetListRecipeIngredientsQuerySchema>;
