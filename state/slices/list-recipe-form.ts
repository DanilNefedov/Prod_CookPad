import { NewIngredientRootState, RecipeAmout, RecipeAutocompite, RecipeChoiceUnits } from "@/app/(main)/(main-list)/list-recipe/types";
import { Amount, Autocompite, ChoiceUnits, IngredientAutocomplite } from "@/app/(main)/new-recipe/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from 'uuid';





// export type ListReciprFormOperationKey =
//   | 'fetchList'



// const listOperationKeys: ListReciprFormOperationKey[] = [
//     'fetchList',
// ];

interface NewIngredientState {
    [recipeId: string]: IngredientAutocomplite[];
}



const initialState: NewIngredientState = {
    // ingredients: [
    //     {
    //         ingredient_id: uuidv4(),
    //         name: "",
    //         media: "",
    //         new_ingredient:false,
    //         units: {
    //             choice: '',
    //             amount: 0,
    //             list: []
    //         },
    //     }
    // ]
}





const formListRecipe = createSlice({
    name: 'formListRecipe',
    initialState,
    reducers: {
        choiceAutoIngredient(state, action: PayloadAction<RecipeAutocompite>) {
            const { recipeId, ingredient } = action.payload;
            const { ingredient_id, name, new_ingredient, media, units } = ingredient;

            const ingredients = state[recipeId];

            const findIngr = ingredients.find(el => el.ingredient_id === ingredient_id);
            if (!findIngr) return;

            findIngr.name = name;
            findIngr.media = media;
            findIngr.new_ingredient = new_ingredient;

            if ("list" in findIngr.units) {
                findIngr.units.list = units;
            }

        },

        amountNewIngredient(state, action: PayloadAction<RecipeAmout>) {
            const { recipeId, ingredient_id, amount } = action.payload;

            const ingredients = state[recipeId];

            const findIngr = ingredients.find(el => el.ingredient_id === ingredient_id);

            if (findIngr) {
                if ('list' in findIngr.units) {
                    findIngr.units.amount = amount;
                }
            }

        },

        choiceUnit(state, action: PayloadAction<RecipeChoiceUnits>) {
            const { recipeId, ingredient_id, choice } = action.payload;

            const ingredients = state[recipeId];

            const findIngr = ingredients.find(el => el.ingredient_id === ingredient_id);
            if (findIngr) {

                if ('list' in findIngr.units) {
                    findIngr.units.choice = choice
                }
            }
        },


        newIngredient(state, action: PayloadAction<{ recipeId: string }>) {
            const { recipeId } = action.payload;

            const newIngredient = {
                ingredient_id: uuidv4(),
                name: "",
                new_ingredient: false,
                media: "",
                units: {
                    choice: "",
                    amount: 0,
                    list: [],
                },
            };

            if (!state[recipeId]) {
                state[recipeId] = [newIngredient];
            } else {
                state[recipeId].push(newIngredient);
            }
        },
        removeIngredient(state, action: PayloadAction<{ ingredient_id: string, recipeId:string }>) {
            const { recipeId, ingredient_id } = action.payload;
            const ingredients = state[recipeId];
            
            const indexToDelete = ingredients.findIndex(
                (ingredient) => ingredient.ingredient_id === ingredient_id
            );

            if (indexToDelete !== -1) {
                ingredients.splice(indexToDelete, 1);
            }
        },

        clearItems(state) {
            return {};
        }
    },
    extraReducers: (builder) => {
    }
})



export const { choiceAutoIngredient, amountNewIngredient, choiceUnit, newIngredient, removeIngredient, clearItems } = formListRecipe.actions


export default formListRecipe.reducer