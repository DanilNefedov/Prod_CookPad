import { z } from 'zod';


// PATCH 


export const PatchModifyRecipeSchema = z.object({
    recipe_id: z.string().min(1),
    modified: z.object({
        name: z.string().optional(),
        description: z.string().optional(),
        time: z.number().optional(),
    }).strict(),
});

//  name:string,
//     time: {
//         hours:string
//         minutes:string 
//     },
//     recipe_type:string
//     description: string
//     instruction:string,
//     sorting:string[]

export type PatchModifyRecipeInput = z.infer<typeof PatchModifyRecipeSchema>;


export const PatchModifyRecipeResponseSchema = z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    time: z.number().optional(),
});

export type PatchModifyRecipeResponse = z.infer<typeof PatchModifyRecipeResponseSchema>;


// PATCH