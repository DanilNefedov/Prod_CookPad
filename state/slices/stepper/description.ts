import { createSlice, PayloadAction } from "@reduxjs/toolkit"

 

interface InitialStateI {
    description:string
}



const initialState: InitialStateI = {
    description: '',
}




const descriptionSlice = createSlice({
    name: 'descriptionSlice',
    initialState,
    reducers: {
        setDescription(state, action: PayloadAction<string>) {
            state.description = action.payload
        },

        
       
    }

})




export const { setDescription } = descriptionSlice.actions


export default descriptionSlice.reducer