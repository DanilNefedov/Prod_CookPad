import { Avarage, UserHistoryMulti } from "@/app/(main)/popular/types";
import { all, BigNumber, create, } from "mathjs";


function averageCalc({ multiplier, history_length_average }: Avarage): number {
    const math = create(all, {
        number: 'BigNumber',
        precision: 64,
    });

    const newValuesCount = multiplier.length - 1; 
    const firstSum = multiplier.reduce(
        (sum: BigNumber, num: number) => math.add(sum, math.bignumber(num)),
        math.bignumber(0)
    );

    if (history_length_average > newValuesCount) {
        const _previousAverage = math.bignumber(multiplier[0]);

        const oldSum = math.multiply(_previousAverage, math.bignumber(history_length_average));

        const newSum = math.add(oldSum, math.subtract(firstSum, _previousAverage));

        const totalCount = math.add(history_length_average, math.bignumber(newValuesCount));

        const newAverage = math.divide(newSum, totalCount);

        return Number(newAverage.toString());
    } else {
        return Number(math.divide(firstSum, math.bignumber(multiplier.length)).toString());
    }
}

export function categoryUser(popular_config: UserHistoryMulti[], action: boolean, coef: number, categories: string[]): UserHistoryMulti[] {
  
    // 1. Создаем глубокую копию, чтобы не мутировать входные данные (важно для React/Redux/DB)
    // Если среда поддерживает structuredClone, используйте его. Иначе JSON.parse/stringify
    let configList: UserHistoryMulti[] = JSON.parse(JSON.stringify(popular_config));

    // --- ЛОГИКА ДОБАВЛЕНИЯ (action === false) ---
    if (!action) {
        const categoriesToProcess = new Set(categories);

        // Шаг 1: Обновляем уже существующие категории
        for (const item of configList) {
            if (categoriesToProcess.has(item.category)) {
                // Убираем из списка обработки, так как уже нашли
                categoriesToProcess.delete(item.category);

                // Логика обновления множителей
                if (item.multiplier.length >= 50) {
                    const preciseNewAverage = averageCalc({multiplier:item.multiplier, history_length_average:item.history_length_average});
                    item.multiplier = [preciseNewAverage, coef];
                    // item.history_length_average += 1; // Оставляем вашу логику инкремента
                } else {
                    item.multiplier.push(coef);
                }
                item.history_length_average += 1;
            }
        }

        // Шаг 2: Добавляем новые категории (те, что остались в Set)
        for (const newCategory of categoriesToProcess) {
            if (configList.length < 50) {
                // Если есть место -> просто добавляем
                configList.push({
                    category: newCategory,
                    multiplier: [coef],
                    history_length_average: 1,
                });
            } else {
                // Если места нет (>= 50) -> ищем слабейшего и заменяем
                
                // Оптимизация: ищем индекс элемента с минимальным средним значением
                let minIndex = -1;
                let minAvg = Infinity;

                for (let i = 0; i < configList.length; i++) {
                    // Считаем среднее только если это необходимо.
                    // Можно оптимизировать: хранить текущее среднее в объекте, чтобы не пересчитывать.
                    // Но при длине 50 это допустимо.
                    const currentAvg = averageCalc({multiplier:configList[i].multiplier, history_length_average:configList[i].history_length_average});
                    
                    if (currentAvg < minAvg) {
                        minAvg = currentAvg;
                        minIndex = i;
                    }
                }

                // Если коэффициент новой категории больше самого слабого элемента -> заменяем
                if (minAvg < coef && minIndex !== -1) {
                    configList[minIndex] = {
                        category: newCategory,
                        multiplier: [coef],
                        history_length_average: 1,
                        // _id не переносим, так как это новая запись
                    };
                }
            }
        }
    } 
    
    // --- ЛОГИКА УДАЛЕНИЯ (action === true) ---
    else {
        // Используем Set для быстрого поиска
        const categoriesToRemove = new Set(categories);

        configList.forEach((item) => {
            if (categoriesToRemove.has(item.category)) {
                const index = item.multiplier.indexOf(coef);

                if (index !== -1) {
                    item.multiplier.splice(index, 1);
                    item.history_length_average = Math.max(0, item.history_length_average - 1);
                } else {
                    // Логика из вашего кода: если точного совпадения нет, добавляем отрицательный
                    item.multiplier.push(-coef);
                    item.history_length_average += 1;
                }
            }
        });

        // Очищаем пустые записи (если массив множителей пуст)
        configList = configList.filter((item) => item.multiplier.length > 0);
    }

    return configList;
}



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


