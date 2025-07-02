import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { resetAllState } from "./reset-action"


export interface TypeRecommendState{
    type_recipe:string,
    recommendation:boolean
}


const initialState: TypeRecommendState = {
    type_recipe: '',
    recommendation:false,
}




const stepTypeRecommend = createSlice({
    name: 'stepTypeRecommend',
    initialState,
    reducers: {
        changeType(state, action: PayloadAction<string>) {
            state.type_recipe = action.payload
        },

        openRecommendation(state, action: PayloadAction<boolean>) {
            state.recommendation = !action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(resetAllState, () => initialState);
    },

})




export const { changeType, openRecommendation} = stepTypeRecommend.actions


export default stepTypeRecommend.reducer