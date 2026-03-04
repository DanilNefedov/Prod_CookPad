import ListIngredients from "@/app/models/list";
import { CreateIngredientItemDTO } from "./schema";

interface ProcessCreateIngredientsParams {
    connection_id: string;
    data: CreateIngredientItemDTO[];
}

export async function processCreateIngredients({ connection_id, data }: ProcessCreateIngredientsParams) {
    const results = [];
    const notFound = [];

    for (const el of data) {
        const { name, media, units } = el;

        if (!units) {
            notFound.push(name || "unknown");
            continue;
        }

        const { choice, amount } = units;

        if (typeof choice === "undefined" || typeof amount === "undefined") {
            notFound.push(name || "unknown");
            continue;
        }

        const existing = await ListIngredients.findOne({ connection_id, name });

        if (existing) {
            const newUnit = { choice, amount, shop_unit: false };

            existing.units.push(newUnit);
            await existing.save();

            const savedUnit = existing.units[existing.units.length - 1];

            results.push({
                ingredient_id: existing._id.toString(),
                type: "updated",
                new_unit: {
                    unit_id: savedUnit._id.toString(),
                    choice: savedUnit.choice,
                    amount: savedUnit.amount,
                    shop_unit: savedUnit.shop_unit,
                },
            });
        } else {
            const created = await ListIngredients.create({
                connection_id,
                name,
                media,
                shop_ingr: false,
                units: [{ choice, amount, shop_unit: false }],
                list: units.list,
            });

            const lastUnit = created.units[created.units.length - 1];

            results.push({
                ingredient_id: created._id.toString(),
                type: "created",
                name: created.name,
                media: created.media,
                shop_ingr: created.shop_ingr,
                list: created.list ?? [],
                new_unit: {
                    unit_id: lastUnit._id.toString(),
                    choice: lastUnit.choice,
                    amount: lastUnit.amount,
                    shop_unit: lastUnit.shop_unit,
                },
            });
        }
    }

    return {results, notFound};
}
