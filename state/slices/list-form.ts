import { NewIngredientRootState } from "@/app/(main)/(main-list)/list-recipe/types";
import { Amount, Autocompite, ChoiceUnits } from "@/app/(main)/new-recipe/types";
import { createOperations, createOperationStatus } from "@/app/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from 'uuid';




export type ListFormOperationKey =
  | 'fetchList'
//   | 'newIngredientList'
//   | 'newUnitIngredientList'
//   | 'updateCookUnit'
//   | 'toggleShopIngrFetch'
//   | 'shopUnitUpdate'
//   | 'deleteIngredientFetch'
//   | 'deleteUnitIngrFetch'
//   | 'changeAmountFetch'
//   | 'addNewUnit'



const listOperationKeys: ListFormOperationKey[] = [
    'fetchList',
    // 'newIngredientList',
    // 'newUnitIngredientList',
    // 'updateCookUnit',
    // 'toggleShopIngrFetch',
    // 'shopUnitUpdate',
    // 'deleteIngredientFetch',
    // 'deleteUnitIngrFetch',
    // 'changeAmountFetch',
    // 'addNewUnit'
];


interface NewIngredientState extends NewIngredientRootState {
    // operations: OperationState<ListOperationKey>
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
    
    
    // operations:createOperations<ListFormOperationKey>(
    //     listOperationKeys,
    //     (key) =>
    //     loadingStatus.includes(key)
    //         ? createOperationStatus(false)
    //         : createOperationStatus()
    // )
}




const newIngredient = createSlice({
    name: 'newIngredient',
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
        }
    },
    extraReducers: (builder) => {
    }
})



export const { choiceAutoIngredient, amountNewIngredient, choiceUnit } = newIngredient.actions

    
export default newIngredient.reducer