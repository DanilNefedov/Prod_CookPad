import { storage } from "@/firebase";
import { AppDispatch } from "@/state/store";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';
import _ from "lodash";
import { IFetchDataRecipe, IngredientForAutocomplite, unitsState } from "@/app/types/types";
import { resetStateRecipes } from "@/state/slices/recipe-slice";
import { StepTypeRecommend } from "@/state/slices/stepper/type-recommend";
import { NameTimeT } from "@/state/slices/stepper/name-time";
import { MediaT } from "@/state/slices/stepper/media";
import { IngredientT } from "@/state/slices/stepper/ingredients";
import { InitialStateDescriptionI } from "@/state/slices/stepper/description";
import { InitialStateI } from "@/state/slices/stepper/instruction";
import { resetAllState } from "@/state/slices/stepper/reset-action";



interface dataType {
    id: string,
    idRecipe: string,
    media_id: string,
    media_url: string,
}



async function uploadFile(data: dataType) {
    const { id, idRecipe, media_id, media_url } = data

    const response = await fetch(media_url);
    const blob = await response.blob();

    const storageRef = ref(storage, `recipes/${id}/${idRecipe}/${media_id}`);

    const uploadTask = uploadBytesResumable(storageRef, blob);

    return new Promise((resolve, reject) => {
        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                }
            },
            (error) => {

                switch (error.code) {
                    case 'storage/unauthorized':
                        break;
                    case 'storage/canceled':
                        break;
                    case 'storage/unknown':
                        break;
                }
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log('File available at', downloadURL);
                    resolve(downloadURL);
                }).catch((error) => {
                    console.error('Error getting download URL:', error);
                    reject(error);
                    return { error, message: error instanceof Error ? error.message : 'Error getting download URL' };
                });
            }
        );
    });
}
type SaveFormResult = {
    error?: unknown;
    message?: string | null;
} | null;


export async function saveForm(
    stepTypeRecommendation: StepTypeRecommend, 
    stepNameTime: NameTimeT, 
    stepMedia: MediaT, 
    stepIngredients: IngredientT, 
    stepDescription: InitialStateDescriptionI, 
    stepInstruction: InitialStateI,
    userId: string, 
    userName: string,
    dispatch: AppDispatch
): Promise<SaveFormResult>{
    const idRecipe = uuidv4();

    console.log(stepTypeRecommendation, stepNameTime, stepMedia, stepIngredients, stepDescription, stepInstruction);

    try {
        
        // Handle media uploads
        const uploadPromises = stepMedia.media.map(file => {
            if (typeof file.media_url === 'string') {
                const data = {
                    id: userId,
                    idRecipe,
                    media_id: file.media_id,
                    media_url: file.media_url,
                };
                return uploadFile(data);
            }
            return Promise.resolve(null);
        });

        const downloadURLs = await Promise.all(uploadPromises);

        // Process ingredients
        const ingredientsWithValues = stepIngredients.ingredients.filter(
            (ingredient): ingredient is IngredientForAutocomplite & { units: unitsState } =>
                ingredient.name.trim() !== '' &&
                typeof ingredient.units === 'object' &&
                !Array.isArray(ingredient.units) &&
                ingredient.units.amount !== 0 &&
                ingredient.units.choice.trim() !== ''
        );
                
        const ingredientsCopy = ingredientsWithValues.map(ingredient =>
            _.omit(ingredient, ['new_ingredient'])
        );
        
        console.log(ingredientsCopy);
        
        // Format media array with download URLs
        const mediaArray = stepMedia.media.map((mediaObj, index) => {
            return {
                main: mediaObj.main,
                media_url: downloadURLs[index] as string,
                media_id: mediaObj.media_id,
                media_type: mediaObj.media_type
            };
        });

        const data: IFetchDataRecipe = {
            connection_id: userId,
            recipe_id: idRecipe,
            name: stepNameTime.name.value.trim(),
            time: { hours: stepNameTime.time.hours, minutes: stepNameTime.time.minutes },
            media: mediaArray || [],
            recipe_type: stepTypeRecommendation.type_recipe,
            description: stepDescription.description.trim(),
            sorting: [stepTypeRecommendation.type_recipe.toLowerCase()],
            instruction: stepInstruction.instruction.trim(),
            ingredients: ingredientsCopy,
            favorite: false
        };

        if (stepTypeRecommendation.recommendation) {
            const ingredientNames = ingredientsCopy.map((el: IngredientForAutocomplite) => el.name);

            // Calculate recommendation data
            const mediaF = mediaArray.length / 10;
            const descrF = stepDescription.description.trim().length < 100 ? stepDescription.description.trim().length / 100 : 1;
            const instF = stepInstruction.instruction.trim().length < 250 ? stepInstruction.instruction.trim().length / 250 : 1;
            const nameF = stepNameTime.name.value.trim() !== '' ? 1 : 0;
            const timeF = stepNameTime.time.hours !== '' && stepNameTime.time.minutes !== '' ? 1 : 0;
            const typeF = stepTypeRecommendation.type_recipe !== '' ? 1 : 0;
            const ingrF = ingredientsCopy.length >= 1 ? 1 : 0;

            const newDataRecomm = {
                fully: parseFloat(((mediaF + descrF + instF + nameF + timeF + typeF + ingrF) / 7).toFixed(16)),
                likes: 0,
                views: 0,
                saves: 0,
                comments: 0,
                categories: _.filter([
                    userName,
                    stepTypeRecommendation.type_recipe,
                    ...ingredientNames
                ], (item) => item !== null),
                creator: null
            };

            // Process ingredients data
            interface fetchIngredients {
                name: string,
                unit: string,
                new_ingredient: boolean
            }
            
            const ingredientsData: fetchIngredients[] = ingredientsWithValues.map(el => ({
                name: el.name,
                unit: 'list' in el.units && el.units.choice ? el.units.choice : '',
                new_ingredient: el.new_ingredient ?? false
            }));

            try {
                // Process ingredients
                const response = await fetch('/api/ingredients', {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(ingredientsData)
                });
                
                const result = await response.json();

                if (result.body && result.body.length > 0) {
                    await fetch('/api/ingredients', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(result.body)
                    });
                }

                // Add new recipe with recommendation
                const recipeResponse = await fetch(`/api/recipe`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        recipeData: data,
                        recomData: newDataRecomm
                    }),
                });

                if (!recipeResponse.ok) {
                    throw new Error('Server Error!');
                }

                const recipeData = await recipeResponse.json();
                console.log(recipeData);
                dispatch(resetAllState());
                dispatch(resetStateRecipes());
                
                return null;
            } catch (error) {
                return { error, message: error instanceof Error ? error.message : 'Error processing ingredients or saving recipe' };
            }
        } else {
            try {
                // Add new recipe without recommendation
                const response = await fetch(`/api/recipe`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        recipeData: data,
                        recomData: null
                    }),
                });

                if (!response.ok) {
                    throw new Error('Server Error!');
                }

                const recipeData = await response.json();
                console.log(recipeData);
                dispatch(resetAllState());
                dispatch(resetStateRecipes());
                
                return null;
            } catch (error) {
                return { error, message: error instanceof Error ? error.message : 'Error when creating a recipe' };
            }
        }
    } catch (error) {
        return { error, message: error instanceof Error ? error.message : 'Error when saving a form' };
    }
}