import { NewIngredientRootState } from "@/app/(main)/(main-list)/list-recipe/types";
import { Amount, Autocompite, ChoiceUnits } from "@/app/(main)/new-recipe/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from 'uuid';




// export type ListFormOperationKey =
//   | 'fetchList'

// const listOperationKeys: ListFormOperationKey[] = [
//     'fetchList',
// ];

interface NewIngredientState extends NewIngredientRootState {
}



const initialState: NewIngredientState = {
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
        }
    ]
}



const newListIngredient = createSlice({
    name: 'newListIngredient',
    initialState,
    reducers: {
        choiceAutoIngredient(state, action: PayloadAction<Autocompite>) {
            const findIngr = state.ingredients.find(el => el.ingredient_id === action.payload.ingredient_id)
            if (findIngr) {
                findIngr.name = action.payload.name
                findIngr.media = action.payload.media
                findIngr.new_ingredient = action.payload.new_ingredient

                if ('list' in findIngr.units) {
                    findIngr.units.list = action.payload.units;
                }
            }
        },

        amountNewIngredient(state, action: PayloadAction<Amount>) {
            const findIngr = state.ingredients.find(el => el.ingredient_id === action.payload.ingredient_id)
            if (findIngr) {
                if ('list' in findIngr.units ) {
                    findIngr.units.amount = action.payload.amount;
                }
            }
            
        },

        choiceUnit(state, action: PayloadAction<ChoiceUnits>){
            const findIngr = state.ingredients.find(el => el.ingredient_id === action.payload.ingredient_id)
            if (findIngr) {

                if ('list' in findIngr.units ) {
                    findIngr.units.choice = action.payload.choice;
                }
            }
        },
        newIngredient(state) {
            const newIngredient = {
                ingredient_id: uuidv4(),
                name: '',
                new_ingredient:false,
                media: '',
                units: { choice: '', amount: 0, list: [] },
            };

            state.ingredients.push(newIngredient);
        },
        removeIngredient(state, action: PayloadAction<{ ingredient_id: string }>) {
            const indexToDelete = state.ingredients.findIndex(
                (ingredient) => ingredient.ingredient_id === action.payload.ingredient_id
            );

            if (indexToDelete !== -1) {
                state.ingredients.splice(indexToDelete, 1);
            }
            
        },

        clearItems(state) {
            state.ingredients = [
                {
                    ingredient_id: uuidv4(),
                    name: "",
                    media: "",
                    new_ingredient: false,
                    units: {
                        choice: "",
                        amount: 0,
                        list: [],
                    },
                },
            ];
        }
    },
    extraReducers: (builder) => {
    }
})



export const { choiceAutoIngredient, amountNewIngredient, choiceUnit, newIngredient, removeIngredient, clearItems } = newListIngredient.actions

    
export default newListIngredient.reducer