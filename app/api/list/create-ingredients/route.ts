import connectDB from "@/app/lib/mongoose";
import ListIngredients from "@/app/models/list";
import { NextResponse } from "next/server";




export async function PATCH(request: Request) {
    try {
        const { connection_id, data } = await request.json();

        if (!connection_id || !data || data.length <= 0) {
            return NextResponse.json(
                { message: 'Invalid request data' },
                { status: 400 }
            );
        }

        await connectDB();


        console.log({ connection_id, data })

        const results = [];
        const notFound: string[] = [];

        for (const el of data) {
            const { ingredient_id, name, media, new_ingredient, units } = el;

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
                    new_unit: newIngredient.units[0],
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

                results.push({
                    ingredient_id: existing._id,
                    new_unit: newUnit,
                    type: "updated",
                });
            }
        }

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