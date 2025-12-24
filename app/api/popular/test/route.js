const fs = require("fs");
const { performance } = require("node:perf_hooks");


const raw = fs.readFileSync("./recipes.json", "utf-8");
const data = JSON.parse(raw);

const popular_config = data.popular_config;





//2, 2, -2, 1.2 -1.3, 1.4
//6
//0.55


//0.55, 2, -2, 1.2 -1.3, 1.4
//5
//0.4182


// function averageCalc() {//{ multiplier, history_length_average }: {multiplier:number[], history_length_average:number}, newValue:number
//     const oldAvg =  2 //multiplier[0] ?? 0; 
//     const oldCount =  0//history_length_average ?? 0;
//     const newValues =[ 2, -2, 1.2 -1.3]//multiplier.slice(1);
//     const newCount = newValues.length;
//     const newValue = 1.4

//     const totalSum = oldAvg * oldCount + newValues.reduce((a,b)=>a+b,0) + newValue;
//     const totalCount = oldCount + newCount + 1;

//     const newAvg = totalSum / totalCount;
//     return { newAvg, totalCount };
// }


// function averageCalc({ multiplier, history_length_average }, newValue) {
//     if (!multiplier || multiplier.length === 0 || history_length_average === 0) {
//         return { newAvg: newValue, totalCount: 1 };
//     }

//     const oldAvg = multiplier[0];
//     const oldCount = history_length_average;
//     const newValues = multiplier.slice(1);
//     const newCount = newValues.length;

//     const totalSum = oldAvg * oldCount + newValues.reduce((a, b) => a + b, 0) + newValue;
//     const totalCount = oldCount + newCount + 1;

//     const newAvg = totalSum / totalCount;
//     return { newAvg, totalCount };
// }

// const multiplier = [2, 2, -2, 1.2, -1.3];
// const history_length_average = 1;
// const newValue = 1.4;

// console.log(averageCalc({ multiplier, history_length_average }, newValue));

const SCALE = 1_000_000n;
let warnedFromBig = false;

function toBig(x) {
    return BigInt(Math.round(x * Number(SCALE)));
}



function fromBig(x) {
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


// function averageCalc({ multiplier, history_length_average }) {
//     if (!multiplier || multiplier.length === 0 || history_length_average === 0) {
//         return { newAvg: multiplier?.[0] ?? 0, totalCount: multiplier.length };
//     }

//     const oldAvg = toBig(multiplier[0]);             
//     const oldCount = BigInt(history_length_average);

//     const tail = multiplier.slice(1).map(toBig);
//     const sumTail = tail.reduce((a, b) => a + b, 0n);

//     const totalSum = oldAvg * oldCount + sumTail;
//     const totalCount = oldCount + BigInt(tail.length);

//     const newAvg = fromBig(totalSum / totalCount);

//     return { newAvg, totalCount: Number(totalCount) };
// }

// function averageCalc({ multiplier, history_length_average }) {
//     if (!multiplier || multiplier.length === 0 || history_length_average === 0) {
//         return multiplier?.[0] ?? 0
//     }

//     const oldAvg = toBig(multiplier[0]);
//     const oldCount = BigInt(history_length_average);

//     const tail = multiplier.slice(1).map(toBig);
//     const sumTail = tail.reduce((a, b) => a + b, 0n);

//     const totalSum = oldAvg * oldCount + sumTail;
//     const totalCount = oldCount + BigInt(tail.length);


//     const newAvg = fromBig(totalSum / totalCount);

//     // console.log(newAvgBig)
//     // const newAvg = fromBig(newAvgBig);
//     // console.log(newAvg)

//     return newAvg;
// }
function averageCalc({ multiplier, history_length_average }) {
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

// const multiplier = [0.55, 2, -2, 1.2, -1.3, 1.4];
// const history_length_average = 6;

// const multiplier = [2, 2, -2, 1.2, -1.3, 1.4];
// const history_length_average = 1;
// const newValue = 1.4;

// const multiplier = [0.4181, 1.5, -2, 1.3, -1.1, 1.7];
// const history_length_average = 11;

// const multiplier = [2, -2];
// const history_length_average = 1;

// console.log(averageCalc({ multiplier, history_length_average }));



function pickWeakestConfig(popular_config) {
    const trusted = popular_config.filter(
        c => c.history_length_average < 50
    );

    const pool = trusted.length > 0 ? trusted : popular_config;

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


// function effectiveValue(avg, history_length_average) {

//     const weight = Math.min(history_length_average, 50);
//     return avg * (1 - weight / 100);
// }

// function confidenceMarginNumber({weakestAvg, weakest, newConfig}) {
    
//     // const capped = Math.min(history, 50);
//     // return 0.35 * Math.log10(capped + 1) / Math.log10(51);
//     // return toBig(0.35 * Math.log10(capped + 1) / Math.log10(51))
//     // console.log(weakestAvg, weakest, newConfig)
//     const oldCount = BigInt(Math.max(weakest, 1));
//     const newCount = BigInt(Math.max(newConfig.history_length_average, 1));

//     // const combinedAvg = (weakestAvg * oldCount + newAvg * newCount) / (oldCount + newCount);

//     return {oldCount, newCount}
// }

function adjustedWeakestAverage(avg, history) {
    if (history <= 1) return avg; 

    const trust = Math.log(history) / (1 + Math.log(history));

    const MAX_BOOST = 0.3; 

    return avg + trust * MAX_BOOST;
}

// console.log(confidenceMarginNumber(49))

function shouldReplace({ popular_config, newConfig }) {
    const { weakest, weakestAvg } = pickWeakestConfig(popular_config);

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
        debug: {
            weakestAvg,
            adjustedWeakestAvg,
            newAvg,
            history: weakest.history_length_average
        },
        weakest
    };
}
// function shouldReplace({ popular_config, newConfig }) {
//     const { weakest, weakestAvg } = pickWeakestConfig(popular_config);

//     //A new element at this point will always have 1 history and 1 average value.
//     const newAvg = averageCalc({
//         multiplier: newConfig.multiplier,
//         history_length_average: newConfig.history_length_average < 50 ? 1 : newConfig.history_length_average
//     });

//     console.log({ newAvg, newConfig })

//     const {oldCount, newCount} = confidenceMarginNumber(
//         {weakestAvg,
//         weakest:weakest.history_length_average,
//         newConfig}
//     );

    
//     const combinedAvg = (toBig(weakestAvg) * oldCount + toBig(newAvg) * newCount) / (oldCount + newCount);
//     console.log(fromBig(combinedAvg), { weakest, weakestAvg })

//     return {
//         replace: toBig(newAvg) > combinedAvg,
//         weakestId: weakest._id
//     };
// }




// for (let i = 0; i < 20_000; i++) {
//     pickWeakestConfig(popular_config);
// }

// const ITERATIONS = 100_000;
// const start = performance.now();



// for (let i = 0; i < ITERATIONS; i++) {
//     pickWeakestConfig(popular_config);
// }

// const end = performance.now();

// // console.log(`Time: ${(end - start).toFixed(4)} ms`);
// console.log(
//     `Avg per call: ${((end - start) / ITERATIONS).toFixed(6)} ms`
// );








// const { weakest, weakestAvg } = pickWeakestConfig(popular_config);

// console.log("Weakest config:", weakest);
// console.log("Weakest average:", weakestAvg);

const newConfig = {
    history_length_average: 1,
    multiplier: [1.2]
}

console.log(shouldReplace({ popular_config, newConfig }))


// 1.15 * 0.41 = 0.47
// 1.15 / 0.41 = 2.8
// 0.41 / 1.15 = 0.35