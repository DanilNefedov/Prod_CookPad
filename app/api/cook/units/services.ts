import ListIngredients from "@/app/models/list";
import { GetUnitsQuery } from "./schema";





export async function getIngredientUnits({ connection_id, name, choice }: GetUnitsQuery) {
    const document = await ListIngredients.findOne({ connection_id, name });

    if (!document) {
        return {
            unit_found: null,
            units: null,
        };
    }

    const unitFound = document.units.some((el: any) => el.choice === choice)

    return {
        unit_found: unitFound,
        units: document.units.map((unit: any) => ({
            _id: unit._id.toString(),
            choice: unit.choice,
            amount: unit.amount,
        })),
    };
}