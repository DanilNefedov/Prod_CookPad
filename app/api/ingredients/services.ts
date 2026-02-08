import Ingredients from "@/app/models/ingredients";
import { IngredientInput } from "@/app/types";
import { DEFAULT_UNITS, ONE_DAY } from "@/app/variables";



export async function searchIngredients(input: string) {
    const agg = [
        {
            $search: {
                index: 'ingredients',
                compound: {
                    should: [
                        {
                            text: {
                                query: input,
                                path: 'name',
                                fuzzy: {
                                    maxEdits: 1,// Allow for one typo
                                    prefixLength: input.length >= 4 ? input.length - 2 : 1,// Increase the severity as the length increases
                                },
                                score: {
                                    boost: { value: 5 },// Increase the weight of exact matches
                                },
                            },
                        },
                        {
                            text: {
                                query: input,
                                path: 'name',
                                fuzzy: {
                                    maxEdits: 2,// Allowing for more inaccurate matches
                                    prefixLength: 1,
                                },
                                score: {
                                    boost: { value: 2 },
                                },
                            },
                        },
                    ],
                    minimumShouldMatch: 1,// We guarantee at least one match
                },
            },
        },
        { $limit: 10 },// Limit the number of results
    ];

    return Ingredients.aggregate(agg);
}



export async function createIngredients(data: string[]) {
    const docs = data
        .map(name => ({
            name,
            units: DEFAULT_UNITS,
            count: 1,
            open_for_link: false,
            deletedAt: new Date(Date.now() + ONE_DAY),
        }));

    const result = await Ingredients.insertMany(docs, { ordered: false });

    return {
        inserted: result.length,
    };
}


export function escapeRegex(value: string) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}


export async function updateIngredients(data: IngredientInput[]) {
    const bulkOps = [];
    const newIngredients: string[] = [];

    for (const ingredient of data) {
        if (!ingredient.new_ingredient) {
            bulkOps.push({
                updateOne: {
                    filter: {
                        name: new RegExp(`^${escapeRegex(ingredient.name.trim())}$`, 'i'),
                    },
                    update: [
                        {
                            $set: {
                                count: { $add: ['$count', 1] },
                                open_for_link: true,
                            },
                        },
                        {
                            $set: {
                                deletedAt: {
                                    $cond: [
                                        { $gte: [{ $add: ['$count', 1] }, 2] },
                                        null,
                                        '$deletedAt',
                                    ],
                                },
                            },
                        },
                    ],
                }

            });
        } else {
            newIngredients.push(ingredient.name.trim());
        }
    }

    let updated = 0;

    if (bulkOps.length > 0) {
        const res = await Ingredients.bulkWrite(bulkOps);
        updated = res.modifiedCount;
    }

    return {
        updated,
        newIngredients,
    };
}