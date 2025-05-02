import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { resetAllState } from "./reset-action"

 

export interface InitialStateI {
    instruction:string
}



const initialState: InitialStateI = {
    instruction: '',
}




const instructionSlice = createSlice({
    name: 'instructionSlice',
    initialState,
    reducers: {
        setInstruction(state, action: PayloadAction<string>) {
            state.instruction = action.payload
        },

        
       
    },
    extraReducers: (builder) => {
        builder.addCase(resetAllState, () => initialState);
    },

})




export const { setInstruction } = instructionSlice.actions


export default instructionSlice.reducer