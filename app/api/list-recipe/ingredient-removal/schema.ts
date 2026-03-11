import { z } from "zod";

export const PatchIngredientRemovalSchema = z.object({
    ingredient_id: z.string().min(1),
    connection_id: z.string().min(1),
    _id: z.string().min(1),
}).strict();

export type PatchIngredientRemovalDTO = z.infer<typeof PatchIngredientRemovalSchema>;
