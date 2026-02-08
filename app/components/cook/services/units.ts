import { GetUnitsResponseSchema } from "@/app/api/cook/units/schema";





export async function fetchIngredientUnits(params: {connection_id: string; name: string; choice: string}) {
    const {choice, connection_id, name} = params
    const url = `/api/cook/units?connection_id=${connection_id}&name=${name}&choice=${choice}`

    const res = await fetch(url);

    if (!res.ok) {
        throw new Error('Unit retrieval error');
    }

    const json = await res.json();

    const parsed = GetUnitsResponseSchema.safeParse(json);

    if (!parsed.success) {
        throw new Error('Invalid response shape');
    }

    return parsed.data;
}
