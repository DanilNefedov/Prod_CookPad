import { z } from "zod";















export const PatchUnitRemovalSchema = z.object({
    ingredient_id: z.string().min(1),
    unit_id: z.string().min(1),
}).strict();

export type PatchUnitRemovalDTO = z.infer<typeof PatchUnitRemovalSchema>;
