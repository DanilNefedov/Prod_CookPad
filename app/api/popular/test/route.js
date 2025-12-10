





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

function averageCalc({ multiplier, history_length_average }) {
    if (!multiplier || multiplier.length === 0 || history_length_average === 0) {
        return multiplier?.[0] ?? 0
    }

    const oldAvg = toBig(multiplier[0]);
    const oldCount = BigInt(history_length_average);

    const tail = multiplier.slice(1).map(toBig);
    const sumTail = tail.reduce((a, b) => a + b, 0n);

    const totalSum = oldAvg * oldCount + sumTail;
    const totalCount = oldCount + BigInt(tail.length);

    // ИСПРАВЛЕНО: Для сохранения дробной части при делении BigInt,
    // мы умножаем числитель (totalSum) на SCALE перед делением на знаменатель (totalCount).
    // Это "переводит" результат деления в наш BigInt-формат с фиксированной точкой.
    const newAvg = fromBig(totalSum / totalCount);

    // console.log(newAvgBig)
    // const newAvg = fromBig(newAvgBig);
    console.log(newAvg)

    return newAvg;
}

// const multiplier = [0.55, 2, -2, 1.2, -1.3, 1.4];
// const history_length_average = 6;

const multiplier = [2, 2, -2, 1.2, -1.3, 1.4];
const history_length_average = 1;
// const newValue = 1.4;

// const multiplier = [0.4181, 1.5, -2, 1.3, -1.1, 1.7];
// const history_length_average = 11;

console.log(averageCalc({ multiplier, history_length_average }));
