import { createSlice, PayloadAction } from "@reduxjs/toolkit"





interface NameTimeT{
    name:{
        value:string
    },
    time:{
        minutes: string,
        hours: string,
    }
}

const initialState: NameTimeT = {
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
    }

})




export const { changeName, changeHours, changeMinutes} = nameTimeSlice.actions


export default nameTimeSlice.reducer