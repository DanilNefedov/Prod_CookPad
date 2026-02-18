import CookHistory from "@/app/models/cook-history";
import { UpdateHistoryRecipeNameDTO } from "./schema";








export async function updateHistoryRecipeName({user_id, recipe_id, name}: UpdateHistoryRecipeNameDTO) {
    const result = await CookHistory.updateOne(
        { connection_id: user_id },
        { $set: { "history_links.$[elem].recipe_name": name } },
        { arrayFilters: [{ "elem.recipe_id": recipe_id }] }
    );

    if (result.matchedCount === 0) {
        return false;
    }

    return true;
}