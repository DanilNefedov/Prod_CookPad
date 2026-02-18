import { z } from "zod";








export const PatchRemoveRecipeSchema  = z.object({
    connection_id: z.string().min(1),
    recipe_id: z.string().min(1),
}).strict();


export type RemoveRecipeSchemaDTO = z.infer<typeof PatchRemoveRecipeSchema>;
