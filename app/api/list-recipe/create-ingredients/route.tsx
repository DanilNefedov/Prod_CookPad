import connectDB from "@/app/lib/mongoose";
import ListRecipe from "@/app/models/list-recipe";
import mongoose from "mongoose";
import { NextResponse } from "next/server";




export async function PATCH(request: Request) {
    try {
        const { connection_id, ingredients, recipe_id } = await request.json();

        if (!connection_id || !ingredients || ingredients.length <= 0 || !recipe_id) {
            return NextResponse.json(
                { message: 'Invalid request data' },
                { status: 400 }
            );
        }

        await connectDB();

        const results = [];
        const notFound: string[] = [];

        const recipeDoc = await ListRecipe.findOne({
            _id: recipe_id,
            connection_id,
        });

        if (!recipeDoc) {
            return NextResponse.json({ message: "Recipe not found" }, { status: 404 });
        }


        for (const el of ingredients) {
            const { name, media, units } = el;

            if (!name || !units || typeof units.choice === "undefined" || typeof units.amount === "undefined") {
                notFound.push(name || "unknown");
                continue;
            }

            const existing = recipeDoc.recipe.ingredients_list.find(
                (el: any) => el.name === name
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
                        units: newIngredient.units.map(u => ({
                            unit_id: u._id,
                            choice: u.choice,
                            amount: u.amount,
                            shop_unit: u.shop_unit,
                        })),
                    },
                });
            }
        }

        await recipeDoc.save();

        return NextResponse.json({
            results,
            notFound,
        },
            { status: notFound.length > 0 ? 207 : 200 }
        );

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "An internal error occurred" },
            { status: 500 }
        );
    }
}