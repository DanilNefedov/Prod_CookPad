import { z } from "zod";










export const GetListQuerySchema = z.object({
    connection_id: z.string().min(1),
    page_list: z
        .string()
        .regex(/^\d+$/)
        .transform((value) => Number(value))
        .refine((value) => value >= 1),
});


export const DeleteListSchema = z.object({
    _id: z.string().min(1),
});


export type GetListQueryDTO = z.infer<typeof GetListQuerySchema>;
