import { z } from "zod";







export const GetCookHistoryQuerySchema = z.object({
    connection_id: z.string().min(1),
    recipe_id: z.string().min(1),
})


export const PostCookHistorySchema = z.object({
    connection_id: z.string().min(1),
}).strict();


export const HistoryLinkSchema = z.object({
    recipe_id: z.string().min(1),
    recipe_name: z.string().min(1),
}).strict();


export const PatchRecipeToHistorySchema = z.object({
    connection_id: z.string().min(1),
    history_links: HistoryLinkSchema,
}).strict();


export type HistoryLinkDTO = z.infer<typeof HistoryLinkSchema>;
