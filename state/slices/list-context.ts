import { ListContext, UnitRecipeIds } from "@/app/(main)/(main-list)/list/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";






const initialState: ListContext = {
    unit_info:{
        recipe_id: undefined,
        ingredient_id: '',
        unit_id: '',
    },
    input_value:{
        value: '',
        open_input:false
    }
}



const listContext = createSlice({
    name: 'listContext',
    initialState,
    reducers: {
        recordIds(state, action: PayloadAction<UnitRecipeIds>){
            state.unit_info.ingredient_id = action.payload.ingredient_id
            state.unit_info.recipe_id = action.payload.recipe_id
            state.unit_info.unit_id = action.payload.unit_id
        },

        editAmount(state, action: PayloadAction<string>){
            state.input_value.value = action.payload
        },

        openInput(state, action: PayloadAction<boolean>){
            state.input_value.open_input = action.payload
        }
    },
})
    

export const { recordIds, editAmount, openInput } = listContext.actions

    
export default listContext.reducer