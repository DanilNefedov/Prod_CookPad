import { IListObj, MainListRecipe, returnDataRecipeList, TempalteRecipeForList } from "@/app/types/types";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";




const initialState: MainListRecipe = {
    status: false,
    error: false,
    connection_id: '',
    page:0,
    recipes: []
}


interface NewListRecipeT {
    connection_id: string, 
    recipe_id: string
}


interface ReturnPreLoaderMain {
    connection_id:string,
    page:number
    recipe:TempalteRecipeForList[]
}

export const preLoaderMain = createAsyncThunk<ReturnPreLoaderMain, {connection_id:string, page:number}, { rejectValue: string }>(
    'listRecipe/preLoaderMain',
    async function ({connection_id, page}, { rejectWithValue }) {
        try {
            const urlList = `/api/list-recipe?connection_id=${connection_id}&page=${page}`
            const responseList = await fetch(urlList);

            if (!responseList.ok) return rejectWithValue('Server Error!');
            
            const dataList = await responseList.json()

            return dataList

        } catch (error) {
            console.log(error)
            throw error
        }
    }
)





export const newListRecipe = createAsyncThunk<void, NewListRecipeT, { rejectValue: string }>(
    'listRecipe/newListRecipe',
    async function (data, { rejectWithValue }) {
        try {
            console.log(data)
            const urlList = `/api/list-recipe`
            const response = await fetch(urlList, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });


            if (!response.ok) return rejectWithValue('Server Error!');
            const dataList = await response.json()

            console.log(dataList)

        } catch (error) {
            console.log(error)
            throw error
        }
    }
)


interface ReturnIngredientsListrecipe {
    connection_id:string,
    recipe_id:string,
    ingredients:IListObj[]
}


export const ingredientsListRecipe = createAsyncThunk<ReturnIngredientsListrecipe, { connection_id: string, recipe_id: string }, { rejectValue: string }>(
    'listRecipe/ingredientsListRecipe',
    async function ({ connection_id, recipe_id }, { rejectWithValue }) {
        try {
            const urlList = `/api/list-recipe/ingredients?connection_id=${connection_id}&recipe_id=${recipe_id}`
            const responseList = await fetch(urlList);

            if (!responseList.ok) return rejectWithValue('Server Error!');
            const dataList = await responseList.json()

            console.log(dataList)
            return dataList

        } catch (error) {
            console.log(error)
            throw error
        }
    }
)




const listRecipeSlice = createSlice({
    name: 'list-recipe',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(preLoaderMain.pending, (state) => {
                state.status = true,
                state.error = false
            })
            .addCase(preLoaderMain.fulfilled, (state, action: PayloadAction<ReturnPreLoaderMain, string>) => {
                state.error = false,
                state.status = false
                // console.log(action.payload)
                const payload = action.payload
                state.connection_id = payload.connection_id
                state.page = payload.page


                payload.recipe.forEach((recipe) => {
                    if (!state.recipes.some(existingRecipe => existingRecipe.recipe_id === recipe.recipe_id)) {
                        state.recipes.push({
                            recipe_id: recipe.recipe_id,
                            recipe_name: recipe.recipe_name,
                            recipe_media: recipe.recipe_media, 
                            recipe_shop: recipe.recipe_shop,
                            ingredients_list: [] 
                        });
                    }
                });
            })


            .addCase(ingredientsListRecipe.pending, (state) => {
                state.status = true,
                state.error = false
            })
            .addCase(ingredientsListRecipe.fulfilled, (state, action: PayloadAction<ReturnIngredientsListrecipe, string>) => {
                state.error = false;
                state.status = false;
            
                const payload = action.payload;
            
                state.connection_id = payload.connection_id;
            
                if (payload.ingredients.length > 0) {
                    payload.ingredients.forEach(ingr => {
                        const existingRecipeIndex = state.recipes.findIndex(existingRecipe => existingRecipe.recipe_id === payload.recipe_id);
            
                        if (existingRecipeIndex !== -1) {
                            const existingRecipe = state.recipes[existingRecipeIndex];
                            
                            existingRecipe.ingredients_list.push(ingr);
                        }
                    });
                }
            })
            
    }
})



export default listRecipeSlice.reducer
