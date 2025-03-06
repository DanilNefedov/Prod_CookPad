import { MainListRecipe } from "@/app/types/types";
import { createSlice } from "@reduxjs/toolkit";




const initialState: MainListRecipe = {
    status: false,
    error: false,
    connection_id: '',
    recipes: []
}









const listRecipeSlice = createSlice({
    name: 'list-recipe',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder

    }
})



export default listRecipeSlice.reducer
