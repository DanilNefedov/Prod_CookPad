import CookHistory from "@/app/models/cook-history";
import { RemoveRecipeSchemaDTO } from "./schema";







export async function removeRecipeFromHistory({ connection_id, recipe_id }: RemoveRecipeSchemaDTO) {
    const result = await CookHistory.updateOne(
        { connection_id },
        { $pull: { history_links: { recipe_id } } }
    );

    if (result.matchedCount === 0) return { status: 'HISTORY_NOT_FOUND' };

    if (result.modifiedCount === 0) return { status: 'ALREADY_REMOVED' };

    return { status: 'REMOVED' };
}