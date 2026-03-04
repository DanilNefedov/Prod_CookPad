import { Ingredients } from "@/app/(main)/cook/types";
import { RecipeMedia } from "@/app/(main)/types";
import ListRecipe from "@/app/models/list-recipe";
import Recipe from "@/app/models/recipe";
import { DeleteListRecipeDTO, GetListRecipeQueryDTO, PostListRecipeDTO } from "./schema";

type RecipeForList = {
    recipe_id: string;
    name: string;
    media: RecipeMedia[];
    ingredients: Ingredients[];
};

export async function findRecipeForList({ connection_id, recipe_id }: PostListRecipeDTO) {
    return Recipe.findOne({ recipe_id, connection_id });
}

export function transformRecipeForList(recipe: RecipeForList) {
    const recipe_media =
        recipe.media.find((m: RecipeMedia) => m.main) || recipe.media[0];

    return {
        recipe_id: recipe.recipe_id,
        recipe_name: recipe.name,
        recipe_media: {
            url: recipe_media.media_url,
            type: recipe_media.media_type,
        },
        recipe_shop: false,
        ingredients_list: recipe.ingredients.map((ing: Ingredients) => ({
            name: ing.name,
            media: ing.media || "",
            shop_ingr: false,
            units: [
                {
                    choice: ing.units.choice,
                    amount: ing.units.amount,
                    shop_unit: false,
                },
            ],
            list: ing.units.list,
        })),
    };
}

export async function createListRecipe({
    connection_id,
    transformedRecipe,
}: {
    connection_id: string;
    transformedRecipe: ReturnType<typeof transformRecipeForList>;
}) {
    const newListRecipe = new ListRecipe({
        connection_id,
        recipe: transformedRecipe,
    });

    await newListRecipe.save();

    return {
        _id: newListRecipe._id,
        recipe_id: newListRecipe.recipe.recipe_id,
        recipe_name: newListRecipe.recipe.recipe_name,
        recipe_media: newListRecipe.recipe.recipe_media,
        recipe_shop: newListRecipe.recipe.recipe_shop,
        ingredient_ids: [],
    };
}

export async function getListRecipesPage({ connection_id, page }: GetListRecipeQueryDTO) {
    const pageSize = 15;
    const skip = (page - 1) * pageSize;

    const [recipes, totalCount] = await Promise.all([
        ListRecipe.find(
            { connection_id },
            {
                _id: 1,
                connection_id: 1,
                "recipe.recipe_id": 1,
                "recipe.recipe_name": 1,
                "recipe.recipe_shop": 1,
                "recipe.recipe_media.url": 1,
                "recipe.recipe_media.type": 1,
            }
        )
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(pageSize)
            .lean(),
        ListRecipe.countDocuments({ connection_id }),
    ]);

    const hasMore = skip + recipes.length < totalCount;
    const nextPage = hasMore ? page + 1 : null;

    return {
        connection_id,
        recipe: recipes.map(({ _id, recipe }) => ({
            ...recipe,
            _id,
        })),
        page: nextPage,
    };
}

export async function deleteListRecipe({ connection_id, recipe_id }: DeleteListRecipeDTO) {
    return ListRecipe.findOneAndDelete({
        connection_id,
        _id: recipe_id,
    });
}
