import ListIngredients from "@/app/models/list";
import { PatchUnitRemovalDTO } from "./schema";













export async function removeUnitFromIngredient({ ingredient_id, unit_id }: PatchUnitRemovalDTO) {
    return ListIngredients.findOneAndUpdate(
        { _id: ingredient_id },
        { $pull: { units: { _id: unit_id } } }
    );
}
