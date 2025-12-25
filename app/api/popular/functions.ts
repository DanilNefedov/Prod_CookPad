
export interface UserHistoryMulti{
    category: string,
    multiplier: number[],
    history_length_average: number
    _id?:string
}

// export interface UserHistoryMulti{
//     category: string,
//     multiplier: number[],
//     history_length_average: number
// }


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

function shouldReplace({ old_popular_config, newConfig }:{old_popular_config:UserHistoryMulti[], newConfig:UserHistoryMulti}) {
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


function pickWeakestConfig(old_popular_config:UserHistoryMulti[]) {
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



export function categoryUser(popular_config: UserHistoryMulti[], action: boolean, coef: number, categories: string[]) {
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
        const newConfig: UserHistoryMulti = {
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












































































// import { Avarage, UserHistoryMulti } from "@/app/(main)/popular/types";
// import { all, BigNumber, create, } from "mathjs";


// function averageCalc({ multiplier, history_length_average }: Avarage): number {
//     const math = create(all, {
//         number: 'BigNumber',
//         precision: 64,
//     });

//     const newValuesCount = multiplier.length - 1; 
//     const firstSum = multiplier.reduce(
//         (sum: BigNumber, num: number) => math.add(sum, math.bignumber(num)),
//         math.bignumber(0)
//     );

//     if (history_length_average > newValuesCount) {
//         const _previousAverage = math.bignumber(multiplier[0]);

//         const oldSum = math.multiply(_previousAverage, math.bignumber(history_length_average));

//         const newSum = math.add(oldSum, math.subtract(firstSum, _previousAverage));

//         const totalCount = math.add(history_length_average, math.bignumber(newValuesCount));

//         const newAverage = math.divide(newSum, totalCount);

//         return Number(newAverage.toString());
//     } else {
//         return Number(math.divide(firstSum, math.bignumber(multiplier.length)).toString());
//     }
// }



// item, categoryStrength {
//   likes: 0,
//   saves: 0,
//   comments: 3,
//   views: 100,
//   categories: [ 'Fin Tart', 'Snack', 'sdfs', 'Sugar' ],
//   fully: 0.6322857142857143,
// } 2.5249999999999996e-7






// export function categoryUser(popular_config: UserHistoryMulti[], action: boolean, coef: number, categories: string[]): UserHistoryMulti[] {
  
//     let configList: UserHistoryMulti[] = JSON.parse(JSON.stringify(popular_config));
//     console.log(popular_config)

//     if (!action) {
//         const categoriesToProcess = new Set(categories);

//         for (const item of configList) {
//             if (categoriesToProcess.has(item.category)) {
//                 categoriesToProcess.delete(item.category);

//                 if (item.multiplier.length >= 50) {
//                     const preciseNewAverage = averageCalc({multiplier:item.multiplier, history_length_average:item.history_length_average});
//                     item.multiplier = [preciseNewAverage, coef];
//                 } else {
//                     item.multiplier.push(coef);
//                 }
//                 item.history_length_average += 1;
//             }
//         }

//         for (const newCategory of categoriesToProcess) {
//             if (configList.length < 50) {
//                 configList.push({
//                     category: newCategory,
//                     multiplier: [coef],
//                     history_length_average: 1,
//                 });
//             } else {
                
//                 let minIndex = -1;
//                 let minAvg = Infinity;

//                 for (let i = 0; i < configList.length; i++) {
//                     const currentAvg = averageCalc({multiplier:configList[i].multiplier, history_length_average:configList[i].history_length_average});
                    
//                     if (currentAvg < minAvg) {
//                         minAvg = currentAvg;
//                         minIndex = i;
//                     }
//                 }

//                 if (minAvg < coef && minIndex !== -1) {
//                     configList[minIndex] = {
//                         category: newCategory,
//                         multiplier: [coef],
//                         history_length_average: 1,
//                     };
//                 }
//             }
//         }
//     } 
    
//     else {
//         const categoriesToRemove = new Set(categories);

//         configList.forEach((item) => {
//             if (categoriesToRemove.has(item.category)) {
//                 const index = item.multiplier.indexOf(coef);

//                 if (index !== -1) {
//                     item.multiplier.splice(index, 1);
//                     item.history_length_average = Math.max(0, item.history_length_average - 1);
//                 } else {
//                     item.multiplier.push(-coef);
//                     item.history_length_average += 1;
//                 }
//             }
//         });

//         configList = configList.filter((item) => item.multiplier.length > 0);
//     }

//     return configList;
// }



// export function categoryUser(popular_config: UserHistoryMulti[], action: boolean, coef:number, categories: string[]): UserHistoryMulti[] {

//     //It may be necessary in the future to check the length of popular_config
//     if (popular_config.length === 0 && !action) {
//         return categories.map(category => ({
//             // id: uuidv4(),
//             category,
//             multiplier: !action ? [coef] : [],
//             history_length_average: 1,
//             // creator:_id,
//         }));
//     }

//     if (!action) {
//         if (popular_config.length >= 50) {

//             // Step 1: Iterate through popular_config and modify where necessary
//             let updatedConfig = popular_config.map(config => {
//                 if (categories.includes(config.category)) {

//                     if (config.multiplier.length >= 50) {
                        
//                         const preciseNewAverage = averageCalc(config);

//                         // DONT CHANGE THE LOCATION FOR THE preciseNewAverage CONST
//                         config.multiplier = [preciseNewAverage, coef];

//                         config.history_length_average += 1
//                         return config;
//                     } else {

//                         config.multiplier.push(coef);
//                         config.history_length_average += 1
//                         return config;
//                     }


//                 }
//                 return config;
//             });

//             // Step 2: If there are categories without matches, 
//             //remove the object with the smallest multiplier if it’s less than coef and replace it
//             categories.forEach(category => {
//                 const isCategoryInConfig = updatedConfig.some(config => config.category === category);

//                 if (!isCategoryInConfig) {

//                     popular_config.forEach(config => {         
//                         const preciseNewAverage = averageCalc(config);
                        
//                         // DONT CHANGE THE LOCATION FOR THE preciseNewAverage CONST
//                         config.multiplier = [preciseNewAverage];
//                     });

//                     const minMultiplierConfig = updatedConfig.reduce((prev, curr) => {
//                         return prev.multiplier[0] < curr.multiplier[0] ? prev : curr;
//                     });

//                     if (minMultiplierConfig.multiplier[0] < coef) {
//                         updatedConfig = updatedConfig.filter(config => config !== minMultiplierConfig);

//                         const newConfig = {
//                             // id: uuidv4(),
//                             category,
//                             multiplier: !action ? [coef] : [],
//                             history_length_average: 1,
//                             // creator:_id,
//                         };

//                         updatedConfig.push(newConfig);
//                     }
//                 }
//             });

//             return updatedConfig;

//         } else {
//             const updatedConfig = popular_config.map(config => {
//                 if (categories.includes(config.category)) {
//                     if (config.multiplier.length >= 50) {
//                         const preciseNewAverage = averageCalc(config);
        
//                         // DONT CHANGE THE LOCATION FOR THE preciseNewAverage CONST
//                         config.multiplier = [preciseNewAverage, coef];
//                         config.history_length_average += 1;
//                     } else {
//                         config.multiplier.push(coef);
//                         config.history_length_average += 1;
//                     }
//                 }
//                 return config;
//             });
        
//             categories.forEach(category => {
//                 const isCategoryInConfig = updatedConfig.some(config => config.category === category);
        
//                 if (!isCategoryInConfig && updatedConfig.length < 50) {
//                     const newConfig = {
//                         // id: uuidv4(),
//                         category,
//                         multiplier: !action ? [coef] : [],
//                         history_length_average: 1,
//                         // creator:_id,
//                     };
        
//                     updatedConfig.push(newConfig);
//                 }
//             });
        
//             return updatedConfig;
//         }
//     } else {
//         return popular_config.map(config => {
//             if (categories.includes(config.category)) {
//                 const index = config.multiplier.indexOf(coef);

//                 if (index !== -1) {
//                     config.multiplier.splice(index, 1);
//                     config.history_length_average -= 1;
//                 } else {
//                     config.multiplier.push(-coef);
//                     config.history_length_average += 1;
//                 }
//             }
//             return config;
//         }).filter(config => config.multiplier.length > 0); 
//     }


// }



