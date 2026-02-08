import { z } from 'zod';





//GET


export const GetUnitsQuerySchema = z.object({
    connection_id: z.string(),
    name: z.string().trim().min(1),//.max(50)
    choice: z.string().trim(),
});

export const UnitSchema = z.object({
    _id: z.string(),
    choice: z.string().trim(),
    amount: z.number(),
});

export const GetUnitsResponseSchema = z.union([
    z.object({
        unit_found: z.null(),
        units: z.null(),
    }),
    z.object({
        unit_found: z.boolean(),
        units: z.array(UnitSchema),
    }),
]);

export type GetUnitsQuery = z.infer<typeof GetUnitsQuerySchema>;
// export type GetUnitsResponse = z.infer<typeof GetUnitsResponseSchema>;


//GET
