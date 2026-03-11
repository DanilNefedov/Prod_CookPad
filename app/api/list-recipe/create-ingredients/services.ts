import ListRecipe from "@/app/models/list-recipe";
import mongoose from "mongoose";
import { RecipeIngredientItemDTO } from "./schema";

interface ProcessCreateRecipeIngredientsParams {
    recipe_id: string;
    ingredients: RecipeIngredientItemDTO[];
    recipeDoc: any;
}

export async function findRecipeDocForCreateIngredients(connection_id: string, recipe_id: string) {
    return ListRecipe.findOne({
        _id: recipe_id,
        connection_id,
    });
}

export function processCreateRecipeIngredients({
    recipe_id,
    ingredients,
    recipeDoc,
}: ProcessCreateRecipeIngredientsParams) {
    const results = [];
    const notFound: string[] = [];

    for (const el of ingredients) {
        const { name, media, units } = el;

        if (!name || !units || typeof units.choice === "undefined" || typeof units.amount === "undefined") {
            notFound.push(name || "unknown");
            continue;
        }

        const existing = recipeDoc.recipe.ingredients_list.find(
            (item: any) => item.name === name
        );

        if (existing) {
            const newUnit = {
                _id: new mongoose.Types.ObjectId(),
                choice: units.choice,
                amount: units.amount,
                shop_unit: false,
            };

            existing.units.push(newUnit);

            results.push({
                recipe_id,
                ingredient_id: existing._id,
                name,
                type: "updated",
                new_unit: {
                    unit_id: newUnit._id,
                    ...newUnit,
                },
            });
        } else {
            const newIngredient = {
                _id: new mongoose.Types.ObjectId(),
                name,
                media: media || "",
                shop_ingr: false,
                list: units.list || [],
                units: [
                    {
                        _id: new mongoose.Types.ObjectId(),
                        choice: units.choice,
                        amount: units.amount,
                        shop_unit: false,
                    },
                ],
            };

            recipeDoc.recipe.ingredients_list.push(newIngredient);

            results.push({
                recipe_id,
                ingredient_id: newIngredient._id,
                name,
                type: "created",
                new_ingredient: {
                    ...newIngredient,
                    units: newIngredient.units.map((unit) => ({
                        unit_id: unit._id,
                        choice: unit.choice,
                        amount: unit.amount,
                        shop_unit: unit.shop_unit,
                    })),
                },
            });
        }
    }

    return { results, notFound };
}
