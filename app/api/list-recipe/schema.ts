import { z } from "zod";

export const PostListRecipeSchema = z.object({
    connection_id: z.string().min(1),
    recipe_id: z.string().min(1),
}).strict();

export const GetListRecipeQuerySchema = z.object({
    connection_id: z.string().min(1),
    page: z.preprocess(
        (value) => {
            if (typeof value !== "string" || value.length === 0) {
                return "1";
            }

            return value;
        },
        z
            .string()
            .regex(/^\d+$/)
            .transform((value) => Number(value))
            .refine((value) => value >= 1)
    ),
}).strict();

export const DeleteListRecipeSchema = z.object({
    connection_id: z.string().min(1),
    recipe_id: z.string().min(1),
}).strict();

export type PostListRecipeDTO = z.infer<typeof PostListRecipeSchema>;
export type GetListRecipeQueryDTO = z.infer<typeof GetListRecipeQuerySchema>;
export type DeleteListRecipeDTO = z.infer<typeof DeleteListRecipeSchema>;
