import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { resetAllState } from "./reset-action";



interface Steps {
    error_status: Record<string, boolean | string[]>;
    open: boolean;
}

interface ErrorState  {
    some_error:boolean
    active_page:number
    steps: Record<number, Steps>; 
}




const initialState: ErrorState = {
    active_page:1,
    some_error:true,
    steps: {
        1: {
            error_status: {
                value: true
            }, 
            open: false 
        },
        2: {
            error_status: {
                name: true, 
                time: true, 
            }, 
            open: false 
        },
        3: {
            error_status: {
                value: true
            }, 
            open: false 
        },
        4: {
            error_status: {
                value: []
            }, 
            open: false 
        },
        5: {
            error_status: {
                value: true
            },
            open: false 
        },
        6: {
            error_status: {
                value: true
            }, 
            open: false 
        },
    }
}





const statusStepSlice = createSlice({
    name: 'statusStepSlice',
    initialState,
    reducers: {
        hasOpen(state, action: PayloadAction<number>) {
            const stepNumber = action.payload;
            if (state.steps[stepNumber]) {
                state.steps[stepNumber].open = true;
            }
        },


        updateError(state, action: PayloadAction<{step:number, error:boolean}>){
            const stepNumber = action.payload.step;
            if (state.steps[stepNumber] && stepNumber !== 2 && stepNumber !== 4) {
                state.steps[stepNumber].error_status.value = action.payload.error;
            }
        },



        errorName(state, action: PayloadAction<boolean>){
            state.steps[2].error_status.name = action.payload
        },

        errorTime(state, action: PayloadAction<boolean>){
            state.steps[2].error_status.time = action.payload
            // state.steps[2].error_status.minutes = action.payload.minutes
        },



        addErrorIngredient(state, action: PayloadAction<string>) {
            const value = state.steps[4].error_status.value;
        
            if (Array.isArray(value)) {
                const arr = value as string[];
                if (!arr.includes(action.payload)) {
                    arr.push(action.payload);
                }
            }
        },

        deleteErrorIngredient(state, action: PayloadAction<string>) {
            const value = state.steps[4].error_status.value;
        
            if (Array.isArray(value)) {
                const arr = value as string[];
                const index = arr.indexOf(action.payload);
                if (index !== -1) {
                    arr.splice(index, 1);
                }
            }
        },
        
        
        setSomeError(state, action:PayloadAction<boolean>){
            state.some_error = action.payload
        },


        setActivePage(state, action:PayloadAction<number>){
            state.active_page = action.payload
        }
        
        
    },
    extraReducers: (builder) => {
        builder.addCase(resetAllState, () => initialState);
    },
})




export const { hasOpen, updateError, errorName, errorTime, addErrorIngredient, deleteErrorIngredient, setSomeError, setActivePage } = statusStepSlice.actions


export default statusStepSlice.reducer