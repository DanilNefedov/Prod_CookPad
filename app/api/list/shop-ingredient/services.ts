import ListIngredients from "@/app/models/list";
import { PatchShopIngredientDTO } from "./schema";







export async function toggleShopIngredient({ _id, shop_ingr }: PatchShopIngredientDTO) {
    return ListIngredients.findOneAndUpdate(
        { _id },
        { $set: { shop_ingr: !shop_ingr } }
        // { new: true }//if I need to return an updated object or do something with it
    );
}
