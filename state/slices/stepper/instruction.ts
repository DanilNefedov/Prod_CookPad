import { createSlice, PayloadAction } from "@reduxjs/toolkit"

 

interface InitialStateI {
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

        
       
    }

})




export const { setInstruction } = instructionSlice.actions


export default instructionSlice.reducer