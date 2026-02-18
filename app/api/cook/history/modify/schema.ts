import { z } from "zod";










export const PatchHistoryRecipeNameSchema = z.object({
    user_id: z.string().min(1),
    recipe_id: z.string().min(1),
    name: z.string().trim().min(1).max(150),
}).strict();


export type UpdateHistoryRecipeNameDTO = z.infer<typeof PatchHistoryRecipeNameSchema>;
