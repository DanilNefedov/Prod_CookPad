import CookHistory from "@/app/models/cook-history";
import Recipe from "@/app/models/recipe";



interface linkT {
    recipe_id: string
    recipe_name: string
    _id: string
}



export async function getCookHistoryWithRecipe(connection_id: string, recipe_id: string) {
    const cook = await CookHistory
        .findOne({ connection_id })
        .select('-_id connection_id history_links.recipe_id history_links.recipe_name')


    if (!cook) {
        return null;
    }

    const exists = cook.history_links.some(
        (link: linkT) => link.recipe_id === recipe_id
    );

    if (exists) {
        return { cook, newCook: null };
    }

    const newCook = await Recipe
        .findOne({ recipe_id, connection_id })
        .select('-_id name recipe_id')
        .lean();

    return { cook, newCook };
}



export async function addRecipeToCookHistory(connection_id: string, history_link: linkT) {
    const exists = await CookHistory.exists({ connection_id });

    if (!exists) {
        return { status: 'NOT_FOUND' };
    }

    const result = await CookHistory.updateOne(
        {
            connection_id,
            'history_links.recipe_id': { $ne: history_link.recipe_id },
        },
        {
            $push: { history_links: history_link },
        }
    );

    if (result.modifiedCount === 0) {
        return { status: 'ALREADY_EXISTS' };
    }

    return { status: 'ADDED' };
}