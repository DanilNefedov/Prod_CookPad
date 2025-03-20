import { all, BigNumber, create, evaluate } from "mathjs";

interface userT {
    // id: string,
    category: string,
    multiplier: number[],
    history_length_average: number
}

interface AvarageDataT{
    multiplier: number[],
    history_length_average: number
}

function averageCalc ({multiplier, history_length_average }:AvarageDataT): number{
    const math = create(all, ({
        number: 'BigNumber',                                
        precision: 64,         
    }))


    const firstSum = multiplier.reduce(
        (sum: BigNumber, num: number) => math.add(sum, math.bignumber(num)),
        math.bignumber(0)
    );
    
    const _preciseAverage = math.bignumber(multiplier[0]);
    
    const sum = math.multiply(_preciseAverage, math.subtract(history_length_average, 49));
    
    const newSum = history_length_average <= 50
        ? firstSum 
        : math.add(sum, math.subtract(firstSum, _preciseAverage));
    
    const newAverage = math.divide(
        newSum,
        history_length_average <= 50
        ? multiplier.length 
        : history_length_average
    );

    const resString = newAverage.toString()
    const resNumb = evaluate(resString)
    
    return resNumb;
}
//
//   1.2, 1.3, 2, 1, 1.5, 1.2 / 6 = 1,35
//      
//   1.35 * 6 = 8.1
//
//   8.1, 1.2, 1.4, 2, 1, 1,7 / 11 = 1,4
//   
//   1.2, 1.3, 2, 1, 1.5, 1.2, 1.2, 1.4, 2, 1, 1,7 / 11 = 1,409090909090909
//
//
//


export function categoryUser(popular_config: userT[], action: boolean, coef:number, categories: string[]): userT[] {

    //It may be necessary in the future to check the length of popular_config
    if (popular_config.length === 0 && !action) {
        return categories.map(category => ({
            // id: uuidv4(),
            category,
            multiplier: !action ? [coef] : [],
            history_length_average: 1,
            // creator:_id,
        }));
    }

    if (!action) {
        if (popular_config.length >= 50) {

            // Step 1: Iterate through popular_config and modify where necessary
            let updatedConfig = popular_config.map(config => {
                if (categories.includes(config.category)) {

                    if (config.multiplier.length >= 10) {
                        
                        const preciseNewAverage = averageCalc({
                            multiplier:config.multiplier, 
                            history_length_average:config.history_length_average
                        });

                        // DONT CHANGE THE LOCATION FOR THE preciseNewAverage CONST
                        config.multiplier = [preciseNewAverage, coef];

                        config.history_length_average += 1
                        return config;
                    } else {

                        config.multiplier.push(coef);
                        config.history_length_average += 1
                        return config;
                    }


                }
                return config;
            });

            // Step 2: If there are categories without matches, 
            //remove the object with the smallest multiplier if it’s less than coef and replace it
            categories.forEach(category => {
                const isCategoryInConfig = updatedConfig.some(config => config.category === category);

                if (!isCategoryInConfig) {

                    popular_config.forEach(config => {         
                        const preciseNewAverage = averageCalc({
                            multiplier:config.multiplier, 
                            history_length_average:config.history_length_average
                        });
                        
                        // DONT CHANGE THE LOCATION FOR THE preciseNewAverage CONST
                        config.multiplier = [preciseNewAverage];
                    });

                    const minMultiplierConfig = updatedConfig.reduce((prev, curr) => {
                        return prev.multiplier[0] < curr.multiplier[0] ? prev : curr;
                    });

                    if (minMultiplierConfig.multiplier[0] < coef) {
                        updatedConfig = updatedConfig.filter(config => config !== minMultiplierConfig);

                        const newConfig = {
                            // id: uuidv4(),
                            category,
                            multiplier: !action ? [coef] : [],
                            history_length_average: 1,
                            // creator:_id,
                        };

                        updatedConfig.push(newConfig);
                    }
                }
            });

            return updatedConfig;

        } else {
            let updatedConfig = popular_config.map(config => {
                if (categories.includes(config.category)) {
                    if (config.multiplier.length >= 10) {
                        const preciseNewAverage = averageCalc({
                            multiplier:config.multiplier, 
                            history_length_average:config.history_length_average
                        });
        
                        // DONT CHANGE THE LOCATION FOR THE preciseNewAverage CONST
                        config.multiplier = [preciseNewAverage, coef];
                        config.history_length_average += 1;
                    } else {
                        config.multiplier.push(coef);
                        config.history_length_average += 1;
                    }
                }
                return config;
            });
        
            categories.forEach(category => {
                const isCategoryInConfig = updatedConfig.some(config => config.category === category);
        
                if (!isCategoryInConfig && updatedConfig.length < 50) {
                    const newConfig = {
                        // id: uuidv4(),
                        category,
                        multiplier: !action ? [coef] : [],
                        history_length_average: 1,
                        // creator:_id,
                    };
        
                    updatedConfig.push(newConfig);
                }
            });
        
            return updatedConfig;
        }
    } else {
        return popular_config.map(config => {
            if (categories.includes(config.category)) {
                // const updatedConfig = { ...config };

                const index = config.multiplier.indexOf(coef);
                if (index !== -1) {
                    config.multiplier.splice(index, 1);
                    config.history_length_average -= 1
                    return config
                } else {
                    config.multiplier.push(-coef);
                    config.history_length_average += 1
                    return config
                }
            } else {
                return config
            }
        })
    }


}