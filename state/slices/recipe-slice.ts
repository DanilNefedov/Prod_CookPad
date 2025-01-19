// import { IRecipeSlice, IFetchDataRecipe } from "@/types/types"
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit"
// import { setFavoriteCook } from './cookSlice';
import { IFetchDataRecipe, IRecipeSlice, MainRecipeT } from "@/app/types/types";


type MyAsyncThunkReturn = {
    data: IFetchDataRecipe;
    recipeData: IRecipeSlice;
};

const initialState: IRecipeSlice = {
    status: false,
    error: false,
    recipes: [
    ]
}


export const fetchRecipes = createAsyncThunk<MainRecipeT[], string, { rejectValue: string }>(
    'recipe/fetchRecipes',
    async function (url, { rejectWithValue, dispatch, getState }) {
        try {
            const response = await fetch(url);
            if (!response.ok) return rejectWithValue('Server Error!');
            const data = await response.json()
            console.log(data)
            return data

        } catch (error) {
            console.error(error)
            throw error
        }
    }
)


export interface favoriteDataRecipeT {
    connection_id:string, 
    recipe_id:string, 
    favorite:boolean
}


// export const setFavoriteRecipe = createAsyncThunk<favoriteDataRecipeT, favoriteDataRecipeT, {rejectValue: string}> (
//     'recipe/setFavoriteRecipe',
//     async function (data, {rejectWithValue, dispatch}){
//         try{
//             // console.log(data)
//             const response = await fetch(`/api/recipe/favorite`, {
//                 method: 'PATCH',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(data),
//             });

//             if (!response.ok) {
//                 return rejectWithValue('Server Error!');
//             }
//             // dispatch(setFavoriteCook(data))
//            //DES COMMIT THIS DISPATCH
//             return data;

//         }catch(error){
//             console.error(error)
//             throw error
//         }
//     }
// )


// export const deleteRecipe = createAsyncThunk<{connection_id:string, recipe_id:string}, {connection_id:string, recipe_id:string}, {rejectValue: string}> (
//     'recipe/deleteRecipe',
//     async function (data, {rejectWithValue, dispatch}){
//         try{
//             console.log(data)
//             const response = await fetch(`/api/recipe`, {
//                 method: 'DELETE',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(data),
//             });

//             if (!response.ok) {
//                 return rejectWithValue('Server Error!');
//             }

//             const recipeData = await response.json();
//             console.log(recipeData)
//             return  data;

//         }catch(error){
//             console.error(error)
//             throw error
//         }
//     }
// )



const recipeSlice = createSlice({
    name: 'recipe',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchRecipes.pending, (state) => {
                state.status = true,
                state.error = false
            })
            .addCase(fetchRecipes.fulfilled, (state, action: PayloadAction<MainRecipeT[], string>) => {
                if (action.payload) {
                    state.status = false;
                    state.error = false;
                    const payload = action.payload;

                    payload.map(recipe => {
                        const findeRecipe = state.recipes.find(el => el.recipe_id === recipe.recipe_id)
                        if (!findeRecipe) {
                            const { recipe_id, name, time, media, recipe_type, description, favorite, sorting, } = recipe
                            const { minutes, hours } = time
                            const trimmedMedia = media.map(item => {
                                const { main, media_id, media_type, media_url } = item;
                                return {main, media_id, media_type, media_url}
                            })
                           
                            const sortedSorting = sorting?.map(item => item ? item : '');

                            state.recipes.push({ recipe_id, name, time: { minutes, hours }, media:trimmedMedia, recipe_type, favorite, description, sorting: sortedSorting,})
                        }
                    })

                }
            })
            .addCase(fetchRecipes.rejected, (state) => {
                state.status = false;
                state.error = true;
            })


            // .addCase(setFavoriteRecipe.fulfilled, (state, action: PayloadAction<favoriteDataRecipeT, string>)=>{
            //     state.status = false;
            //     state.error = false;
            //     const payload = action.payload;

            //     const findRecipe = state.recipes.find(el => el.recipe_id === payload.recipe_id)

            //     if(findRecipe){
            //         findRecipe.favorite = !payload.favorite
            //     }
            // })
            // .addCase(setFavoriteRecipe.rejected, (state) => {
            //     state.status = false;
            //     state.error = true;
            // })


            // .addCase(deleteRecipe.fulfilled, (state, action: PayloadAction<{connection_id:string, recipe_id:string}, string>)=>{
            //     state.status = false;
            //     state.error = false;
            //     const payload = action.payload;

            //     state.recipes = state.recipes.filter(recipe => recipe.recipe_id !== payload.recipe_id);

            // })
            // .addCase(deleteRecipe.rejected, (state) => {
            //     state.status = false;
            //     state.error = true;
            // })
           
    }
})


export default recipeSlice.reducer