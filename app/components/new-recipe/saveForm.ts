import { storage } from "@/firebase";
import { resetState, StateStepper } from "@/state/slices/step-by-step";
import { AppDispatch } from "@/state/store";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';
import _ from "lodash";
import { IFetchDataRecipe, IngredientForState } from "@/app/types/types";



interface dataType {
    id: string,
    idRecipe: string,
    media_id: string,
    media_url: string,
    // main:boolean
}



async function uploadFile(data: dataType) {
    const { id, idRecipe, media_id, media_url } = data

    const response = await fetch(media_url);
    const blob = await response.blob();
    // const metadata = {
    //     contentType: 'image/jpeg'
    // };

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
                });
            }
        );
    });
}



export async function saveForm(state: StateStepper, id: string, dispatch: AppDispatch, namaUser: string) {
    const activeSaveBtn = state.steps_info.find(el => el?.open && !el?.error_status)
    const idRecipe = uuidv4()
    console.log(activeSaveBtn, state.steps_info)
    if (activeSaveBtn) return false

    console.log(state.steps_info[2].media)


    if (state.steps_info[2].media && state.steps_info[2].media?.length > 0 && id !== '') {


        const uploadPromises = state.steps_info[2].media.map(file => {
            if (typeof file.media_url === 'string') {
                const data = {
                    id,
                    idRecipe,
                    media_id: file.media_id,
                    media_url: file.media_url,

                    // main:file.main
                }
                return uploadFile(data)
            }

        });
        // console.log(uploadPromises)


        Promise.all(uploadPromises)
            .then(downloadURLs => {
                if (state.steps_info[2].media) {
                    // const ingredientsWithNames = state.steps_info[3].ingredients?.filter(ingredient => ingredient.name !== "");
                    // const ingredientsCopy = JSON.parse(JSON.stringify(ingredientsWithNames));


                    const ingredientsWithNames = _.filter(state.steps_info[3].ingredients, ingredient => ingredient.name !== "");
                    const ingredientsCopy = _.map(ingredientsWithNames, ingredient => _.omit(ingredient, ['new_ingredient']));


                    console.log(ingredientsWithNames, ingredientsCopy, state.steps_info[3].ingredients)

                    const mediaArray = state.steps_info[2].media?.map((mediaObj, index) => {
                        return {
                            main: mediaObj.main,
                            media_url: downloadURLs[index] as string,
                            media_id: mediaObj.media_id,
                            media_type: mediaObj.media_type
                        };
                    });

                    const data: IFetchDataRecipe = {
                        connection_id: id,
                        recipe_id: idRecipe,
                        name: state.steps_info[1].second_option?.name_recipe as string,
                        time: { hours: state.steps_info[1].hours as string, minutes: state.steps_info[1].minutes as string },
                        media: mediaArray || [],
                        recipe_type: state.steps_info[0].type_recipe as string,
                        description: state.steps_info[4].description as string,
                        sorting: [state.steps_info[0].type_recipe as string],
                        instruction: state.steps_info[5].instruction as string,
                        ingredients: ingredientsCopy,
                        favorite: false
                    }


                    // console.log(state.steps_info[0])
                    if (state.steps_info[0].recommendation) {
                        const ingredientNames = ingredientsCopy.map((el: IngredientForState) => el.name);

                        //media - 10
                        //name - 1 
                        //time - 1
                        //type - 1
                        //ingr - 1
                        //descr - 100symb
                        //instruct - 250symb
                        const mediaF = mediaArray.length / 10
                        const descrF = state.steps_info[4].description && state.steps_info[4].description?.length < 100 ? state.steps_info[4].description?.length / 100 : 1
                        const instF = state.steps_info[5].instruction && state.steps_info[5].instruction?.length < 250 ? state.steps_info[5].instruction?.length / 250 : 1
                        const nameF = state.steps_info[1].second_option?.name_recipe !== '' ? 1 : 0
                        const timeF = state.steps_info[1].hours !== '' && state.steps_info[1].minutes !== '' ? 1 : 0
                        const typeF = state.steps_info[0].type_recipe !== '' ? 1 : 0
                        const ingrF = ingredientsCopy.length >= 1 ? 1 : 0


                        // console.log(mediaF, descrF, instF, nameF, timeF, typeF, ingrF)
                        const newDataRecomm = {
                            fully: parseFloat(((mediaF + descrF + instF + nameF + timeF + typeF + ingrF) / 7).toFixed(16)),
                            // liked: false,
                            likes: 0,
                            views: 0,
                            saves: 0,
                            comments: 0,
                            categories: _.filter([
                                namaUser,
                                state.steps_info[0].type_recipe as string,
                                ...ingredientNames
                            ], (item) => item !== null),
                            creator: null
                        }
                        const addNewRecipe = async () => {
                            try {
                                const response = await fetch(`/api/recipe`, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                        recipeData: data,
                                        recomData: newDataRecomm
                                    }),
                                });

                                if (!response.ok) {
                                    throw new Error('Server Error!'); 
                                }

                                const recipeData = await response.json();
                                console.log(recipeData)
                                dispatch(resetState())

                            } catch (error) {
                                console.error('Failed to save recipe:', error);
                            }
                        }
                        // addNewRecipe()
                        // pushNewDataRec(newDataRecomm)
                        console.log(newDataRecomm)


                        interface fetchIngredients {
                            name: string,
                            unit: string,
                            new_ingredient: boolean
                        }
                        const ingredientsData: fetchIngredients[] = ingredientsWithNames.map(el => ({
                            name: el.name,
                            unit: 'list' in el.units && el.units.choice ? el.units.choice : '',
                            new_ingredient: el.new_ingredient ?? false
                        }))

                        const processIngredients = async (ingredients: fetchIngredients[]) => {

                            console.log(ingredients, 'ingredientsingredientsingredientsingredients')
                            try {
                                const response = await fetch('/api/ingredients', {
                                    method: 'PATCH',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify(ingredients)
                                });
                               

                                const result = await response.json();
                                console.log(result, 'resultresultresultresultresultresult')

                                if (result.body && result.body.length > 0) {
                                    const response = await fetch('/api/ingredients', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify(result.body)
                                    });
    
                                }

                                addNewRecipe()
                            } catch (error) {
                                console.error('Failed to save ingredient:', error);
                            }
                        }

                        processIngredients(ingredientsData);



                    } else {
                       
                        const addNewRecipe = async () => {
                            try {
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
                                console.log(recipeData)
                                dispatch(resetState())

                            } catch (error) {
                                console.error('Failed to save recipe:', error);
                            }
                        }
                        addNewRecipe()
                    }
                }
            })
            .catch(error => {
                console.error('Error uploading files:', error);
            });


    }

}
