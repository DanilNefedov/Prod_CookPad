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

function toBig(x) {
    return BigInt(Math.round(x * Number(SCALE)));
}

function fromBig(x) {
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
        history_length_average:
            weakest.history_length_average < 50 ? 1 : weakest.history_length_average
    });

    for (let i = 1; i < pool.length; i++) {
        const c = pool[i];
        const avg = averageCalc({
            multiplier: c.multiplier,
            history_length_average:
                c.history_length_average < 50 ? 1 : c.history_length_average
        });

        if (avg < weakestAvg) {
            weakest = c;
            weakestAvg = avg;
        }
    }

    return { weakest, weakestAvg };
}




for (let i = 0; i < 20_000; i++) {
    pickWeakestConfig(popular_config);
}

const ITERATIONS = 100_000;
const start = performance.now();



for (let i = 0; i < ITERATIONS; i++) {
    pickWeakestConfig(popular_config);
}

const end = performance.now();

// console.log(`Time: ${(end - start).toFixed(4)} ms`);
console.log(
    `Avg per call: ${((end - start) / ITERATIONS).toFixed(6)} ms`
);

const { weakest, weakestAvg } = pickWeakestConfig(popular_config);

console.log("Weakest config:", weakest);
console.log("Weakest average:", weakestAvg);
