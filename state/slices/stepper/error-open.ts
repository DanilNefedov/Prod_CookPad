import { createSlice, PayloadAction } from "@reduxjs/toolkit";



interface StepStatus {
    error_status: Record<string, boolean>;
    open: boolean;
}

interface PageStatusP  {
    steps: Record<number, StepStatus>; 
}




const initialState: PageStatusP = {
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
                value: true
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





const statusSlice = createSlice({
    name: 'statusSlice',
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
            if (state.steps[stepNumber] && stepNumber !== 2) {
                state.steps[stepNumber].error_status.value = action.payload.error;
            }
        },

        errorName(state, action: PayloadAction<boolean>){
            state.steps[2].error_status.name = action.payload
        },

        errorTime(state, action: PayloadAction<boolean>){
            state.steps[2].error_status.time = action.payload
            // state.steps[2].error_status.minutes = action.payload.minutes
        }

        
    }

})




export const { hasOpen, updateError, errorName, errorTime } = statusSlice.actions


export default statusSlice.reducer