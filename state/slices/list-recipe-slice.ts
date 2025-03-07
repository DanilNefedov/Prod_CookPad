import { MainListRecipe } from "@/app/types/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";




const initialState: MainListRecipe = {
    status: false,
    error: false,
    connection_id: '',
    recipes: []
}


interface NewListRecipeT {
    connection_id: string, 
    recipe_id: string
}


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




const listRecipeSlice = createSlice({
    name: 'list-recipe',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder

    }
})



export default listRecipeSlice.reducer
