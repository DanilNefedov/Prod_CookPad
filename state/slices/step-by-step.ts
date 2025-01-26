import { IngredientForState, unitsState } from '@/app/types/types';
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

type NamePayload = {
    step: number,
    name_recipe: string,
    error_status: boolean
}
type MediaPayload = {
    media: MediaObj[],
    error_status: boolean,
    step: number
}
type BtnsMediaSwiper = {
    step:number,
    media_id:string
}
type Amount = {
    ingr_id: string,
    amount: number
}
type Autocompite = {
    ingr_id: string,
    name: string,
    media: string,
    new_ingredient:boolean,
    check_open_link:string,
    units: string[]
}
type Units = {
    ingr_id: string,
    choice: string
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

        changeName(state, action: PayloadAction<NamePayload>) {
            state.steps_info.map(el => {
                if (el.step === action.payload.step && el.second_option) {
                    el.second_option.name_recipe = action.payload.name_recipe;
                    el.second_option.error_status = action.payload.error_status;

                }
            })
        },

        changeHours(state, action: PayloadAction<string>) {
            const thisState = state.steps_info.find(el => el.step === 2)
            if (thisState) {
                thisState.hours = action.payload
                if (thisState.hours === '0' && thisState.minutes === '0') {
                    thisState.error_status = false
                } else {
                    thisState.error_status = true
                }

            }
        },

        changeMinutes(state, action: PayloadAction<string>) {
            const thisState = state.steps_info.find(el => el.step === 2)
            if (thisState) {
                thisState.minutes = action.payload
                if (thisState.hours === '0' && thisState.minutes === '0') {
                    thisState.error_status = false
                } else {
                    thisState.error_status = true
                }
            }
        },
        
        changeMedia(state, action: PayloadAction<MediaPayload>) {
            const thisState = state.steps_info.find(el => el.step === action.payload.step)
            if (thisState) {
                console.log(action.payload.media)
                thisState.media?.push(...action.payload.media)
                thisState.error_status = action.payload.error_status
            }
        },

        deleteMediaState(state, action: PayloadAction<BtnsMediaSwiper>){
            const thisStep = state.steps_info.find(el => el.step === action.payload.step)
            if (thisStep) {
                thisStep.media = thisStep.media?.filter(item => item.media_id !== action.payload.media_id);
            }
        },

        setMainMedia(state, action: PayloadAction<BtnsMediaSwiper>){
            const thisStep = state.steps_info.find(el => el.step === action.payload.step);
            if (thisStep) {
                const clickedElement = thisStep.media?.find(el => el.media_id === action.payload.media_id);

                if (clickedElement) {
                    if (clickedElement.main) {
                        thisStep.media?.forEach(el => {
                            el.main = false;
                        });
                    } else {
                        thisStep.media?.forEach(el => {
                            el.main = el.media_id === action.payload.media_id;
                        });
                    }
                }
            }
        },

        addIngredient(state) {
            const newIngredient = {
                ingredient_id: uuidv4(),
                name: '',
                new_ingredient:false,
                media: '',
                units: { choice: '', amount: 0, list: [] },
            };
            const thisStep = state.steps_info.find((el) => el.step === 4);
            if (thisStep && thisStep.ingredients) {
                thisStep.ingredients.push(newIngredient);
            }
        },


        deleteIngredient(state, action: PayloadAction<{ ingredient_id: string }>) {
            const thisStep = state.steps_info.find((el) => el.step === 4);
            if (thisStep && thisStep.ingredients) {
                const indexToDelete = thisStep.ingredients.findIndex(
                    (ingredient) => ingredient.ingredient_id === action.payload.ingredient_id
                );

                if (indexToDelete !== -1) {
                    thisStep.ingredients.splice(indexToDelete, 1);
                }
            }
        },

        errorAutocomplite(state) {
            const thisStep = state.steps_info.find(el => el.step === 4);
            if (thisStep && thisStep.ingredients) {
                const hasAtLeastOneIngredient = thisStep.ingredients.some(ingredient => {
                    return ingredient.name.trim() !== "";
                });

                const hasEmptyChoiceAndNonZeroAmount = thisStep.ingredients.some(ingredient => {
                    if ('units' in ingredient) {
                        const units = ingredient.units as unitsState;
                        return units.amount !== 0 && units.choice?.trim() !== "";
                    }
                    return false;
                });
                thisStep.error_status = hasAtLeastOneIngredient && hasEmptyChoiceAndNonZeroAmount;
            }
        },

        ingredientAmount(state, action: PayloadAction<Amount>) {
            const thisStep = state.steps_info.find(el => el.step === 4)
            if (thisStep && thisStep.ingredients) {
                const findIngr = thisStep.ingredients.find(el => el.ingredient_id === action.payload.ingr_id)
                if (findIngr) {
                    if ('list' in findIngr.units) {
                        findIngr.units.amount = action.payload.amount;
                    }
                }
            }
        },

        choiceAutocomplite(state, action: PayloadAction<Autocompite>) {
            console.log(action.payload)
            const thisStep = state.steps_info.find(el => el.step === 4)
            if (thisStep && thisStep.ingredients) {
                const findIngr = thisStep.ingredients.find(el => el.ingredient_id === action.payload.ingr_id)
                if (findIngr) {
                    findIngr.name = action.payload.name
                    findIngr.media = action.payload.media
                    findIngr.new_ingredient = action.payload.new_ingredient
                    if ('list' in findIngr.units) {
                        findIngr.units.list = action.payload.units;
                    }
                }
            }
        },

        choiceUnits(state, action: PayloadAction<Units>) {
            const thisStep = state.steps_info.find(el => el.step === 4)
            if (thisStep && thisStep.ingredients) {
                const findIngr = thisStep.ingredients.find(el => el.ingredient_id === action.payload.ingr_id)
                if (findIngr) {
                    if ('list' in findIngr.units) {
                        findIngr.units.choice = action.payload.choice;
                    }
                }
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
    changeName,
    changeHours,
    changeMinutes,
    changeMedia,
    deleteMediaState,
    setMainMedia,
    addIngredient,
    deleteIngredient,
    errorAutocomplite,
    ingredientAmount,
    choiceAutocomplite,
    choiceUnits,
    
    
    resetState,
} = stepByStep.actions


export default stepByStep.reducer