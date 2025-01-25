import { IngredientForState } from '@/app/types/types';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';



type MediaObj = {
    main: boolean,
    media_url: File | null | string,
    media_id: string,
    media_type:string
}

type StepInfo = {
    step: number;
    error_status: boolean;
    open: boolean,
    type_recipe?: string;
    recommendation?:boolean;
    name_recipe?: string;
    minutes?: string;
    hours?: string;
    media?: MediaObj[];
    ingredients?: IngredientForState[];
    description?: string;
    instruction?: string;
    second_option?: {
        error_status: boolean,
        name_recipe: string,
    }
};

export type StateStepper = {
    status: boolean;
    page_step: number,
    steps_info: StepInfo[];
};


const initialState: StateStepper = {
    status: false,
    page_step: 1,
    steps_info: [
        {
            step: 1,
            error_status: false,
            open: false,
            type_recipe: '',
            recommendation:false,
        },
        {
            step: 2,
            error_status: false,
            open: false,
            second_option: {
                error_status: false,
                name_recipe: '',
            },
            minutes: '0',
            hours: '0',
        },
        {
            step: 3,
            error_status: false,
            open: false,
            media: [],
        },
        {
            step: 4,
            error_status: false,
            open: false,
            ingredients: [
                {
                    ingredient_id: uuidv4(),
                    name: "",
                    media: "",
                    new_ingredient:false,
                    units: {
                        choice: '',
                        amount: 0,
                        list: []
                    },
                    check_open_link:''
                }
            ]
        },
        {
            step: 5,
            error_status: false,
            open: false,
            description: '',
        },
        {
            step: 6,
            error_status: false,
            open: false,
            instruction: '',
        }

    ],
}

type TypePayload = {
    step: number,
    type: string,
    error_status: boolean
}



const stepByStep = createSlice({
    name: 'stepByStep',
    initialState,
    reducers: {
        changeSteps(state, action: PayloadAction<number>) {
            state.page_step = action.payload
        },
        hasOpen(state, action: PayloadAction<number>) {
            const thisState = state.steps_info.find(el => el.step === action.payload)
            if (thisState) {
                thisState.open = true
            }
        },
        changeType(state, action: PayloadAction<TypePayload>) {
            const thisState = state.steps_info.find(el => el.step === action.payload.step)
            if (thisState) {
                thisState.type_recipe = action.payload.type
                thisState.error_status = action.payload.error_status
            }
        },

        openRecommendation(state, action: PayloadAction<boolean>){
            const thisState = state.steps_info.find(el => el.step === 1)
            if (thisState) {
                thisState.recommendation = !action.payload
            }
        },
        
        resetState: () => initialState,

    },
})


export const {
    changeSteps,
    hasOpen,
    changeType,
    openRecommendation,

    
    resetState,
} = stepByStep.actions


export default stepByStep.reducer