





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


function averageCalc({ multiplier, history_length_average }, newValue) {
    if (!multiplier || multiplier.length === 0 || history_length_average === 0) {
        return { newAvg: newValue, totalCount: 1 };
    }

    const oldAvg = multiplier[0];
    const oldCount = history_length_average;
    const newValues = multiplier.slice(1);
    const newCount = newValues.length;

    const totalSum = oldAvg * oldCount + newValues.reduce((a, b) => a + b, 0) + newValue;
    const totalCount = oldCount + newCount + 1;

    const newAvg = totalSum / totalCount;
    return { newAvg, totalCount };
}

const multiplier = [0.55, 2, -2, 1.2, -1.3];
const history_length_average = 6;
const newValue = 1.4;

console.log(averageCalc({ multiplier, history_length_average }, newValue));
