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

        const results = [];
        const notFound: string[] = [];

        for (const el of data) {
            const { name, media, units } = el;

            if (!units || typeof units.choice === 'undefined' || typeof units.amount === 'undefined') {
                notFound.push(name || 'unknown');
                continue;
            }

            const existing = await ListIngredients.findOne({ connection_id, name });

            if (existing) {
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
                    type: 'updated',
                    new_unit: savedUnit,
                    name: existing.name,
                });
            } else {

                const created = await ListIngredients.create({
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
                    ingredient_id: created._id,
                    name,
                    media,
                    shop_ingr: false,
                    list: units.list,
                    units:created.units[created.units.length - 1],
                    type: "created",
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