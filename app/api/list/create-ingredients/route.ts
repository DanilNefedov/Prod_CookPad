import { CreateIngredientsFetchReq } from "@/app/(main)/(main-list)/list/types";
import { IngredientAutocomplite } from "@/app/(main)/new-recipe/types";
import connectDB from "@/app/lib/mongoose";
import ListIngredients from "@/app/models/list";
import { NextResponse } from "next/server";




export async function PATCH(request: Request) {
    try {
        const { connection_id, data }:any = await request.json();

        if (!connection_id || !data || data.length <= 0) {
            return NextResponse.json(
                { message: 'Invalid request data' },
                { status: 400 }
            );
        }

        await connectDB();



        const results = [];
        const notFound: string[] = [];

        for (const el of data) {
            const { ingredient_id, name, media, new_ingredient, units } = el;


            console.log({ units })
            if (new_ingredient) {
                const newIngredient = await ListIngredients.create({
                    connection_id,
                    name,
                    media,
                    shop_ingr: false,
                    units: [
                        {
                            choice: units.choice,
                            amount: units.amount,
                            shop_unit: false,
                        },
                    ],
                    list: units.list,
                });

                results.push({
                    ingredient_id: newIngredient._id,
                    name,
                    media,
                    shop_ingr: false,
                    list: units.list,
                    units:newIngredient.units[newIngredient.units.length - 1],
                    // new_unit: newIngredient.units[0],
                    type: "created",
                });
            } else {
                const existing = await ListIngredients.findOne({
                    connection_id,
                    name,
                });

                if (!existing) {
                    notFound.push(el.name);
                    continue;
                }

                const newUnit = {
                    choice: units.choice,
                    amount: units.amount,
                    shop_unit: false,
                };

                existing.units.push(newUnit);
                await existing.save();

                const savedUnit = existing.units[existing.units.length - 1];

                results.push({
                    ingredient_id: existing._id,
                    new_unit: savedUnit,
                    type: "updated",
                });
            }
        }

        return NextResponse.json({
            results,
            notFound,
        },
        { status: 207 }//notFound.length > 0 ? 207 : 200
        );

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "An internal error occurred" },
            { status: 500 }
        );
    }
}