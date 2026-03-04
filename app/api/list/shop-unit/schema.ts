import { z } from "zod";












export const PatchShopUnitSchema = z.object({
    ingredient_id: z.string().min(1),
    unit_id: z.string().min(1),
    shop_unit: z.boolean(),
}).strict();

export type PatchShopUnitDTO = z.infer<typeof PatchShopUnitSchema>;
