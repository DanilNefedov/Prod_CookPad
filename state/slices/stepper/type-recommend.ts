import { createSlice, PayloadAction } from "@reduxjs/toolkit"


interface StepTypeRecommend{
    type_recipe:string,
    recommendation:boolean
}


const initialState: StepTypeRecommend = {
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
    }

})




export const { changeType, openRecommendation} = stepTypeRecommend.actions


export default stepTypeRecommend.reducer