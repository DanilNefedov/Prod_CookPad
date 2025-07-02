import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { resetAllState } from "./reset-action"





export interface NameTimeState{
    name:{
        value:string
    },
    time:{
        minutes: string,
        hours: string,
    }
}

const initialState: NameTimeState = {
    name: {
        value:''
    },
    time:{
        minutes: '0',
        hours: '0',
    }
}




const nameTimeSlice = createSlice({
    name: 'nameTimeSlice',
    initialState,
    reducers: {
        changeName(state, action: PayloadAction<string>) {
            state.name.value = action.payload
        },

        changeHours(state, action: PayloadAction<string>) {
            state.time.hours = action.payload
        },

        changeMinutes(state, action: PayloadAction<string>) {
            state.time.minutes = action.payload
        },
    },
    extraReducers: (builder) => {
        builder.addCase(resetAllState, () => initialState);
    },

})




export const { changeName, changeHours, changeMinutes} = nameTimeSlice.actions


export default nameTimeSlice.reducer