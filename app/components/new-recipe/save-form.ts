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

async function uploadFile(data: dataType): Promise<string> {
    const { id, idRecipe, media_id, media_url } = data;

    try {
        // Fetch the file
        const response = await fetch(media_url);
        if (!response.ok) {
            throw new Error(`Failed to fetch media: ${response.statusText}`);
        }
        
        const blob = await response.blob();
        
        // Set up Firebase storage reference
        const storageRef = ref(storage, `recipes/${id}/${idRecipe}/${media_id}`);
        const uploadTask = uploadBytesResumable(storageRef, blob);
        
        // Return a promise that handles both upload progress and the final URL
        return new Promise((resolve, reject) => {
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                },
                (error) => {
                    console.error('Upload failed:', error);
                    reject(new Error(`Upload failed: ${error.message || 'Unknown error'}`));
                },
                async () => {
                    try {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        // console.log('File available at', downloadURL);
                        resolve(downloadURL);
                    } catch (error) {
                        console.error('Error getting download URL:', error);
                        reject(new Error(`Failed to get download URL: ${error instanceof Error ? error.message : 'Unknown error'}`));
                    }
                }
            );
            
            // Add timeout for network issues
            setTimeout(() => {
                reject(new Error('Upload timed out. Please check your network connection.'));
            }, 60000); // 60 second timeout
        });
    } catch (error) {
        console.error('Error in uploadFile:', error);
        throw new Error(`Media upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
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
): Promise<SaveFormResult> {
    const idRecipe = uuidv4();

    // console.log('Form data:', { stepTypeRecommendation, stepNameTime, stepMedia, stepIngredients, stepDescription, stepInstruction });

    try {
        // Handle media uploads with proper error handling
        const uploadPromises = stepMedia.media.map(file => {
            if (typeof file.media_url === 'string') {
                const data = {
                    id: userId,
                    idRecipe,
                    media_id: file.media_id,
                    media_url: file.media_url,
                };
                
                return uploadFile(data).catch(error => {
                    console.error(`Error uploading file ${file.media_id}:`, error);
                    // Re-throw with additional context
                    throw new Error(`Failed to upload media: ${error.message}`);
                });
            }
            return Promise.resolve(null);
        });

        let downloadURLs: (string | null)[] = [];

        try {
            downloadURLs = await Promise.all(uploadPromises);
        } catch (uploadError) {
            console.error("Error during media upload:", uploadError);
            return { 
                error: uploadError, 
                message: uploadError instanceof Error 
                    ? uploadError.message 
                    : 'Failed to upload media. Please check your network connection.'
            };
        }

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
                
                if (!response.ok) {
                    throw new Error(`Failed to update ingredients: ${response.statusText}`);
                }
                
                const result = await response.json();

                if (result.body && result.body.length > 0) {
                    const newIngredientResponse = await fetch('/api/ingredients', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(result.body)
                    });
                    
                    if (!newIngredientResponse.ok) {
                        throw new Error(`Failed to create new ingredients: ${newIngredientResponse.statusText}`);
                    }
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
                    throw new Error(`Failed to save recipe: ${recipeResponse.statusText}`);
                }

                // const recipeData = await recipeResponse.json();
                await recipeResponse.json();
                // console.log('Recipe saved successfully:', recipeData);
                dispatch(resetAllState());
                dispatch(resetStateRecipes());
                
                return null;
            } catch (error) {
                console.error('Error in recommendation flow:', error);
                return { 
                    error, 
                    message: error instanceof Error ? error.message : 'Error processing ingredients or saving recipe' 
                };
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
                    throw new Error(`Failed to save recipe: ${response.statusText}`);
                }
                await response.json();
                // const recipeData = await response.json();
                // console.log('Recipe saved successfully:', recipeData);
                dispatch(resetAllState());
                dispatch(resetStateRecipes());
                
                return null;
            } catch (error) {
                console.error('Error in non-recommendation flow:', error);
                return { 
                    error, 
                    message: error instanceof Error ? error.message : 'Error when creating a recipe' 
                };
            }
        }
    } catch (error) {
        console.error('Error in saveForm:', error);
        return { 
            error, 
            message: error instanceof Error ? error.message : 'Error when saving a form' 
        };
    }
}