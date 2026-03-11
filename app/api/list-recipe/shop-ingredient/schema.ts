import { z } from "zod";

export const PatchShopIngredientSchema = z.object({
    connection_id: z.string().min(1),
    ingredient_id: z.string().min(1),
    shop_ingr: z.boolean(),
    _id: z.string().min(1),
}).strict();

export type PatchShopIngredientDTO = z.infer<typeof PatchShopIngredientSchema>;
