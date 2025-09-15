import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { setFavoriteCook } from "./cook-slice";
import { createOperations, createOperationStatus, OperationState } from "@/app/types";
import { FavoriteRecipeFetch, RecipeData, RecipeRootState } from "@/app/(main)/types";




export type RecipeOperationKey =
  | 'fetchRecipes'
  | 'setFavoriteRecipe'
  


interface RecipeState extends RecipeRootState {
    operations: OperationState<RecipeOperationKey>
}

const initialState: RecipeState = {
    page: 1,
    recipes: [],
    operations:createOperations<RecipeOperationKey>(
        ['fetchRecipes', 'setFavoriteRecipe'],
        (key) => {
            if (key === 'setFavoriteRecipe') {
                return createOperationStatus(false);
            }
            return createOperationStatus();
        }
    )
}


export const fetchRecipes = createAsyncThunk<{recipes:RecipeData[], page:number | null}, {id:string, page:number}, { rejectValue: string }>(
    'recipe/fetchRecipes',
    async function (data, { rejectWithValue}) {
        try {
            const url = `api/recipe?connection_id=${data.id}&page=${data.page}`

            const response = await fetch(url);

            if (!response.ok) return rejectWithValue('Server Error!');

            const dataList = await response.json()

            return dataList
        } catch (error) {
            console.error(error)
            return rejectWithValue('Request failed!');
        }
    }
)


export const setFavoriteRecipe = createAsyncThunk<FavoriteRecipeFetch, FavoriteRecipeFetch, {rejectValue: string}> (
    'recipe/setFavoriteRecipe',
    async function (data, {rejectWithValue, dispatch}){
        try{
            const response = await fetch(`/api/recipe/favorite`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                return rejectWithValue('Server Error!');
            }

            dispatch(setFavoriteCook(data))

            const dataResponse = await response.json()

            return dataResponse;

        }catch(error){
            console.error(error)
            return rejectWithValue('Request failed!');
        }
    }
)


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

const createReducerHandlers = <T extends keyof RecipeState['operations']>(operationName: T) => ({
    pending: (state: RecipeState) => {
        state.operations[operationName].error = false;
        state.operations[operationName].loading = true;
    },
    rejected: (state: RecipeState) => {
        state.operations[operationName].error = true;
        state.operations[operationName].loading = false;
    }
});


const fetchRecipesHandlers = createReducerHandlers('fetchRecipes');
const setFavoriteRecipeHandlers = createReducerHandlers('setFavoriteRecipe');


const recipeSlice = createSlice({
    name: 'recipe',
    initialState,
    reducers:{
        resetStateRecipes(state) {
            return initialState; 
        },

        closeAlertRecipe(state, action: PayloadAction<RecipeOperationKey>){
            const key = action.payload

            if (state.operations[key]) {
                state.operations[key].error = false
                state.operations[key].loading = false
            }
        },

        changeNameRecipe(state, action:PayloadAction<{recipe_id:string, name:string}>){

            const thisRecipe = state.recipes.find(el => el.recipe_id === action.payload.recipe_id)

            if(thisRecipe){
                thisRecipe.name = action.payload.name
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRecipes.pending, fetchRecipesHandlers.pending)
            .addCase(fetchRecipes.rejected, fetchRecipesHandlers.rejected)
            .addCase(fetchRecipes.fulfilled, (state, action: PayloadAction<{ recipes: RecipeData[], page: number | null}, string>) => {
                state.operations.fetchRecipes.error = false
                state.operations.fetchRecipes.loading = false

                if (!action.payload) return;
            
                const { recipes, page } = action.payload;
            
                const newRecipes = recipes.filter(recipe => 
                    !state.recipes.some(existing => existing.recipe_id === recipe.recipe_id)
                );
            
                state.recipes = [...state.recipes, ...newRecipes];
                
                state.page = page
                
            })
            
           


            .addCase(setFavoriteRecipe.pending, setFavoriteRecipeHandlers.pending)
            .addCase(setFavoriteRecipe.rejected, setFavoriteRecipeHandlers.rejected)
            .addCase(setFavoriteRecipe.fulfilled, (state, action: PayloadAction<FavoriteRecipeFetch, string>) => {
                state.operations.setFavoriteRecipe.error = false
                state.operations.setFavoriteRecipe.loading = false
                
                const { recipe_id } = action.payload;
            
                const recipeIndex = state.recipes.findIndex(el => el.recipe_id === recipe_id);
            
                if (recipeIndex !== -1) {
                    // const newFavoriteStatus = !state.recipes[recipeIndex].favorite;
                    state.recipes[recipeIndex].favorite = action.payload.favorite;
            
                    if (action.payload.favorite) {
                        if (!state.recipes[recipeIndex].sorting.includes('favorite')) {
                            state.recipes[recipeIndex].sorting.push('favorite');
                        }
                    } else {
                        const favoriteIndex = state.recipes[recipeIndex].sorting.indexOf('favorite');
                        if (favoriteIndex !== -1) {
                            state.recipes[recipeIndex].sorting.splice(favoriteIndex, 1);
                        }
                    }
                }
            })
            


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
export const { resetStateRecipes, closeAlertRecipe, changeNameRecipe } = recipeSlice.actions;

export default recipeSlice.reducer