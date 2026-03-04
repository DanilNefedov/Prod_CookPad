import ListIngredients from "@/app/models/list";
import { PatchAmountDTO } from "./schema";

export async function updateAmount({ ingredient_id, unit_id, amount }: PatchAmountDTO) {
    return ListIngredients.findOneAndUpdate(
        { _id: ingredient_id, "units._id": unit_id },
        { $set: { "units.$.amount": amount } }
    );
}
