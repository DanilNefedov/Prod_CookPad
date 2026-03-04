import ListIngredients from "@/app/models/list";
import { PatchShopUnitDTO } from "./schema";












export async function toggleShopUnit({ ingredient_id, unit_id, shop_unit }: PatchShopUnitDTO) {
    return ListIngredients.findOneAndUpdate(
        { _id: ingredient_id, "units._id": unit_id },
        { $set: { "units.$.shop_unit": !shop_unit } }
    );
}
