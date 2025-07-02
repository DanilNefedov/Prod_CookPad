import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from 'uuid';
import { resetAllState } from "./reset-action";
import { Amount, Autocompite, ChoiceUnits, IngredientAutocomplite } from "@/app/(main)/new-recipe/types";







interface IngredientState  {
    ingredients: IngredientAutocomplite[]; 
}




const initialState: IngredientState = {
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



const ingredientsSlice = createSlice({
    name: 'ingredientsSlice',
    initialState,
    reducers: {
        addIngredient(state) {
            const newIngredient = {
                ingredient_id: uuidv4(),
                name: '',
                new_ingredient:false,
                media: '',
                units: { choice: '', amount: 0, list: [] },
            };

            state.ingredients.push(newIngredient);
        },

        deleteIngredient(state, action: PayloadAction<{ ingredient_id: string }>) {
            const indexToDelete = state.ingredients.findIndex(
                (ingredient) => ingredient.ingredient_id === action.payload.ingredient_id
            );

            if (indexToDelete !== -1) {
                state.ingredients.splice(indexToDelete, 1);
            }
            
        },


        ingredientAmount(state, action: PayloadAction<Amount>) {
            const findIngr = state.ingredients.find(el => el.ingredient_id === action.payload.ingredient_id)
            if (findIngr) {
                if ('list' in findIngr.units ) {
                    findIngr.units.amount = action.payload.amount;
                }
            }
            
        },


        choiceAutocomplite(state, action: PayloadAction<Autocompite>) {
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


        choiceUnits(state, action: PayloadAction<ChoiceUnits>) {
            const findIngr = state.ingredients.find(el => el.ingredient_id === action.payload.ingredient_id)
            if (findIngr) {

                if ('list' in findIngr.units ) {
                    findIngr.units.choice = action.payload.choice;
                }
            }
            
        },

    },
    extraReducers: (builder) => {
        builder.addCase(resetAllState, () => initialState);
    },

})




export const { addIngredient, deleteIngredient, ingredientAmount, choiceAutocomplite, choiceUnits } = ingredientsSlice.actions


export default ingredientsSlice.reducer