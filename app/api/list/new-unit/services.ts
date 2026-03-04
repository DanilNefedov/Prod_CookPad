import ListIngredients from "@/app/models/list";
import { PatchNewUnitDTO } from "./schema";

export async function addUnitToIngredient({ ingredient_id, new_unit }: PatchNewUnitDTO) {
    return ListIngredients.findOneAndUpdate(
        { _id: ingredient_id },
        { $push: { units: new_unit } },
        { new: true }
    );
}
