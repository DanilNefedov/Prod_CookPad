import { z } from "zod";






//GET

export const GetRecipeQuerySchema = z.object({
    connection_id: z.string().min(1, "connection_id is required"),
    recipe_id: z.string().min(1, "recipe_id is required"),
});

//GET




//DELETE

export const DeleteRecipeQuerySchema = z.object({
    connection_id: z.string().min(1, "connection_id is required"),
    recipe_id: z.string().min(1, "recipe_id is required"),
});

//DELETE