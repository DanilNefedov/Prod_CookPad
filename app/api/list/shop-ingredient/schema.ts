import { z } from "zod";






export const PatchShopIngredientSchema = z.object({
    _id: z.string().min(1),
    shop_ingr: z.boolean(),
}).strict();

export type PatchShopIngredientDTO = z.infer<typeof PatchShopIngredientSchema>;
