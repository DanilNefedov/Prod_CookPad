import { AppDispatch } from "@/state/store";
import { v4 as uuidv4 } from 'uuid';
import _ from "lodash";
import { resetStateRecipes } from "@/state/slices/recipe-slice";
import { TypeRecommendState } from "@/state/slices/stepper/type-recommend";
import { NameTimeState, } from "@/state/slices/stepper/name-time";
import { MediaState, } from "@/state/slices/stepper/media";
import { IngredientState, } from "@/state/slices/stepper/ingredients";
import { DescriptionState,} from "@/state/slices/stepper/description";
import {InstructionState } from "@/state/slices/stepper/instruction";
import { resetAllState } from "@/state/slices/stepper/reset-action";
import { DataType, IngredientAutocomplite, NewDataRecipe, SaveFormResult } from "@/app/(main)/new-recipe/types";
import { Unit } from "@/app/(main)/cook/types";



async function uploadFile(data: DataType): Promise<string>{ 
    const { id, idRecipe, media_id, media_url } = data;
    

    try {
        const response = await fetch(media_url);

        if (!response.ok) {
            throw new Error(`Failed to fetch media: ${response.statusText}`);
        }

        const blob = await response.blob();
        console.log(response, blob)

        const formData = new FormData();
        formData.append("file", blob, media_id);
        formData.append("id", id);
        formData.append("idRecipe", idRecipe);
        formData.append("media_id", media_id);

        const cloudinaryResponse = await fetch("/api/cloudinary-upload", {
            method: "POST",
            body: formData,
        });
        

        if (!cloudinaryResponse.ok) {
            const errorResult = await cloudinaryResponse.json();
            throw new Error(errorResult.error?.message || 'Cloudinary upload failed');
        }


        const result = await cloudinaryResponse.json();

        console.log(result)

        return result;

      
    } catch (error) {
        console.error('Error in uploadFile:', error);
        throw new Error(`Media upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}


export async function saveForm(
    stepTypeRecommendation: TypeRecommendState,
    stepNameTime: NameTimeState,
    stepMedia: MediaState,
    stepIngredients: IngredientState,
    stepDescription: DescriptionState,
    stepInstruction: InstructionState,
    userId: string,
    userName: string,
    dispatch: AppDispatch
):Promise<SaveFormResult> {
    const idRecipe = uuidv4();


    try {
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

        const ingredientsWithValues = stepIngredients.ingredients.filter(
            (ingredient): ingredient is IngredientAutocomplite & { units: Unit } =>
                ingredient.name.trim() !== '' &&
                typeof ingredient.units === 'object' &&
                !Array.isArray(ingredient.units) &&
                ingredient.units.amount !== 0 &&
                ingredient.units.choice.trim() !== ''
        );
                
        const ingredientsCopy = ingredientsWithValues.map(ingredient =>
            _.omit(ingredient, ['new_ingredient'])
        );
        
        const mediaArray = stepMedia.media.map((mediaObj, index) => {
            return {
                main: mediaObj.main,
                media_url: downloadURLs[index] as string,
                media_id: mediaObj.media_id,
                media_type: mediaObj.media_type
            };
        });
 
        console.log(mediaArray)

        // const data: NewDataRecipe = {
        //     connection_id: userId,
        //     recipe_id: idRecipe,
        //     name: stepNameTime.name.value.trim(),
        //     time: { hours: stepNameTime.time.hours, minutes: stepNameTime.time.minutes },
        //     media: mediaArray || [],
        //     recipe_type: stepTypeRecommendation.type_recipe,
        //     description: stepDescription.description.trim(),
        //     sorting: [stepTypeRecommendation.type_recipe.toLowerCase()],
        //     instruction: stepInstruction.instruction.trim(),
        //     ingredients: ingredientsCopy,
        //     favorite: false
        // };

        // if (stepTypeRecommendation.recommendation) {
        //     const ingredientNames = ingredientsCopy.map((el: IngredientAutocomplite) => el.name);

        //     const mediaF = mediaArray.length / 10;
        //     const descrF = stepDescription.description.trim().length < 100 ? stepDescription.description.trim().length / 100 : 1;
        //     const instF = stepInstruction.instruction.trim().length < 250 ? stepInstruction.instruction.trim().length / 250 : 1;
        //     const nameF = stepNameTime.name.value.trim() !== '' ? 1 : 0;
        //     const timeF = stepNameTime.time.hours !== '' && stepNameTime.time.minutes !== '' ? 1 : 0;
        //     const typeF = stepTypeRecommendation.type_recipe !== '' ? 1 : 0;
        //     const ingrF = ingredientsCopy.length >= 1 ? 1 : 0;

        //     const newDataRecomm = {
        //         fully: parseFloat(((mediaF + descrF + instF + nameF + timeF + typeF + ingrF) / 7).toFixed(16)),
        //         likes: 0,
        //         views: 0,
        //         saves: 0,
        //         comments: 0,
        //         categories: _.filter([
        //             userName,
        //             stepTypeRecommendation.type_recipe,
        //             ...ingredientNames
        //         ], (item) => item !== null),
        //         creator: null
        //     };

        //     interface fetchIngredients {
        //         name: string,
        //         unit: string,
        //         new_ingredient: boolean
        //     }
            
        //     const ingredientsData: fetchIngredients[] = ingredientsWithValues.map(el => ({
        //         name: el.name,
        //         unit: 'list' in el.units && el.units.choice ? el.units.choice : '',
        //         new_ingredient: el.new_ingredient ?? false
        //     }));

        //     try {
        //         const response = await fetch('/api/ingredients', {
        //             method: 'PATCH',
        //             headers: {
        //                 'Content-Type': 'application/json',
        //             },
        //             body: JSON.stringify(ingredientsData)
        //         });
                
        //         if (!response.ok) {
        //             throw new Error(`Failed to update ingredients: ${response.statusText}`);
        //         }
                
        //         const result = await response.json();

        //         if (result.body && result.body.length > 0) {
        //             const newIngredientResponse = await fetch('/api/ingredients', {
        //                 method: 'POST',
        //                 headers: {
        //                     'Content-Type': 'application/json',
        //                 },
        //                 body: JSON.stringify(result.body)
        //             });
                    
        //             if (!newIngredientResponse.ok) {
        //                 throw new Error(`Failed to create new ingredients: ${newIngredientResponse.statusText}`);
        //             }
        //         }

        //         const recipeResponse = await fetch(`/api/recipe`, {
        //             method: 'POST',
        //             headers: {
        //                 'Content-Type': 'application/json',
        //             },
        //             body: JSON.stringify({
        //                 recipeData: data,
        //                 recomData: newDataRecomm
        //             }),
        //         });

        //         if (!recipeResponse.ok) {
        //             throw new Error(`Failed to save recipe: ${recipeResponse.statusText}`);
        //         }

        //         // const recipeData = await recipeResponse.json();
        //         await recipeResponse.json();
        //         // console.log('Recipe saved successfully:', recipeData);
        //         dispatch(resetAllState());
        //         dispatch(resetStateRecipes());
                
        //         return null;
        //     } catch (error) {
        //         console.error('Error in recommendation flow:', error);
        //         return { 
        //             error, 
        //             message: error instanceof Error ? error.message : 'Error processing ingredients or saving recipe' 
        //         };
        //     }
        // } else {
        //     try {
        //         const response = await fetch(`/api/recipe`, {
        //             method: 'POST',
        //             headers: {
        //                 'Content-Type': 'application/json',
        //             },
        //             body: JSON.stringify({
        //                 recipeData: data,
        //                 recomData: null
        //             }),
        //         });

        //         if (!response.ok) {
        //             throw new Error(`Failed to save recipe: ${response.statusText}`);
        //         }
        //         await response.json();
        //         // const recipeData = await response.json();
        //         // console.log('Recipe saved successfully:', recipeData);
        //         dispatch(resetAllState());
        //         dispatch(resetStateRecipes());
                
        //         return null;
        //     } catch (error) {
        //         console.error('Error in non-recommendation flow:', error);
        //         return { 
        //             error, 
        //             message: error instanceof Error ? error.message : 'Error when creating a recipe' 
        //         };
        //     }
        // }
    } catch (error) {
        console.error('Error in saveForm:', error);
        return { 
            error, 
            message: error instanceof Error ? error.message : 'Error when saving a form' 
        };
    }
}