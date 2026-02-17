import { z } from 'zod';






// PATCH 

export const TimeModifiedSchema = z.object({
    hours: z.number().int().min(0),
    minutes: z.number().int().min(0),
})
.partial()
.strict()
.refine((val) => val.hours != null || val.minutes != null,
    {
        message: "At least hours or minutes must be provided",
    }
);


export const ModifiedSchema = z.object({
    name: z.string().trim().min(1).max(150),
    time: TimeModifiedSchema,
    recipe_type: z.string().trim().min(1),
    description: z.string().trim().min(1).max(150),
    instruction: z.string().trim().min(1).max(300),
    sorting: z.array(z.string()).min(1),
})
.partial()
.strict();



export const PatchRecipeSchema = z.object({
    recipe_id: z.string().min(1),
    modified: ModifiedSchema,
}).strict();


export type PatchRecipeInput = z.infer<typeof PatchRecipeSchema>;
export type ModifiedInput = z.infer<typeof ModifiedSchema>;


// PATCH