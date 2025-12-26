import { UserHistoryMulti } from "@/app/(main)/popular/types";

export interface UserHistoryMultiAL extends UserHistoryMulti{
    _id?:string
}



const SCALE = 1_000_000n;
let warnedFromBig = false;

function toBig(x: number): bigint {
    return BigInt(Math.round(x * Number(SCALE)));
}



function fromBig(x: bigint): number {
    const MAX_SAFE = BigInt(Number.MAX_SAFE_INTEGER);
    const MAX_X = MAX_SAFE * SCALE;

    const oldX = x;

    if (x > MAX_X) x = MAX_X;
    if (x < -MAX_X) x = -MAX_X;

    if (!warnedFromBig && oldX !== x) {
        console.warn(`fromBig: the number was truncated due to size: ${oldX}`);
        warnedFromBig = true;
    }

    return Number(x) / Number(SCALE);
}

function averageCalc({ multiplier, history_length_average }: { multiplier: number[], history_length_average: number }): number  {
    const len = multiplier?.length ?? 0;

    if (len === 0 || history_length_average === 0) {
        return multiplier?.[0] ?? 0;
    }

    let totalSum = toBig(multiplier[0]) * BigInt(history_length_average);
    let totalCount = BigInt(history_length_average);

    for (let i = 1; i < len; i++) {
        totalSum += toBig(multiplier[i]);
        totalCount += 1n;
    }

    return fromBig(totalSum / totalCount);
}

function shouldReplace({ old_popular_config, newConfig }:{old_popular_config:UserHistoryMultiAL[], newConfig:UserHistoryMultiAL}) {
    const { weakest, weakestAvg } = pickWeakestConfig(old_popular_config);

    const newAvg = averageCalc({
        multiplier: newConfig.multiplier,
        history_length_average: 1
    });

    const adjustedWeakestAvg = adjustedWeakestAverage(
        weakestAvg,
        weakest.history_length_average
    );

    return {
        replace: newAvg >= adjustedWeakestAvg,
        weakestId: weakest._id,
    };
}

function adjustedWeakestAverage(avg:number, history:number) {
    if (history <= 1) return avg; 

    const trust = Math.log(history) / (1 + Math.log(history));

    const MAX_BOOST = 0.3; 

    return avg + trust * MAX_BOOST;
}


function pickWeakestConfig(old_popular_config:UserHistoryMultiAL[]) {
    const trusted = old_popular_config.filter(
        c => c.history_length_average < 50
    );

    const pool = trusted.length > 0 ? trusted : old_popular_config;

    let weakest = pool[0];
    let weakestAvg = averageCalc({
        multiplier: weakest.multiplier,
        history_length_average: weakest.history_length_average < 50 ? 1 : weakest.history_length_average
    });

    for (let i = 1; i < pool.length; i++) {
        const c = pool[i];
        const avg = averageCalc({
            multiplier: c.multiplier,
            history_length_average: c.history_length_average < 50 ? 1 : c.history_length_average
        });

        if (avg < weakestAvg) {
            weakest = c;
            weakestAvg = avg;
        }
    }
    return { weakest, weakestAvg };
}

// Change category entry to id 
function normalizeCategory(value: string) {
    return value.trim();
}



export function categoryUser(popular_config: UserHistoryMultiAL[], action: boolean, coef: number, categories: string[]) {
    const MAX_LENGTH = 50
    const delta = action ? -coef : coef;

    // If empty, create a new object 
    if (!popular_config || popular_config.length === 0) {
        return categories.map((category) => ({
            category,
            history_length_average: 1,
            multiplier: [delta],
        }));
    }

    const categoryIndex = new Map();
    for (let i = 0; i < popular_config.length; i++) {
        categoryIndex.set(normalizeCategory(popular_config[i].category), i);
    }

    const result = [...popular_config];

    for (const rawCategory of categories) {
        const category = normalizeCategory(rawCategory);
        const idx = categoryIndex.get(category);

        // Category found
        if (idx !== undefined) {
            const item = result[idx];

            if (item.multiplier.length < MAX_LENGTH) {
                item.multiplier.push(delta);
                item.history_length_average += 1;
            } else {
                const avg = averageCalc({
                    multiplier: item.multiplier,
                    history_length_average: item.history_length_average,
                });

                // DONT CHANGE THE LOCATION FOR THE avg CONST
                item.multiplier[0] = avg;
                item.multiplier.length = 1;
                item.multiplier.push(delta);

                item.history_length_average += 1;
            }

            continue;
        }

        // Category NOT found
        const newConfig: UserHistoryMultiAL = {
            category,
            history_length_average: 1,
            multiplier: [delta],
        };

        // There is free space — just push
        if (result.length < MAX_LENGTH) {
            result.push(newConfig);
            categoryIndex.set(category, result.length - 1);
            continue;
        }

        // No free space — try to replace weakest
        const { replace, weakestId } = shouldReplace({
            old_popular_config: result,
            newConfig,
        });

        // // if (!replace || !weakestId) continue;
        if (!replace) continue;

        // Replace the weakest one
        for (let i = 0; i < result.length; i++) {
            if (String(result[i]._id) === String(weakestId)) {
                result[i] = newConfig;
                categoryIndex.set(category, i);
                break;
            }
        }
    }

    return result;
}
