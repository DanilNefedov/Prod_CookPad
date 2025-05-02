import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { resetAllState } from "./reset-action"

 

export interface InitialStateDescriptionI {
    description:string
}



const initialState: InitialStateDescriptionI = {
    description: '',
}




const descriptionSlice = createSlice({
    name: 'descriptionSlice',
    initialState,
    reducers: {
        setDescription(state, action: PayloadAction<string>) {
            state.description = action.payload
        },

        
       
    },
    extraReducers: (builder) => {
        builder.addCase(resetAllState, () => initialState);
    },

})




export const { setDescription } = descriptionSlice.actions


export default descriptionSlice.reducer