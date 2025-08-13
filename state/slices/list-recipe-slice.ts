import { ChangeAmountListRecipeFetch, DeleteIngrListRecipeFetch, DeleteListRecipeFetchReq, 
    DeleteUnitListRecipeFetch, IngrListRecipeFetchReq, IngrListRecipeFetchRes, ListRecipeData, 
    ListRecipeRootState, NewListRecipeFetchReq, NewUnitListRecipeFetchReq, 
    NewUnitListRecipeFetchRes, PreLoaderFetchReq, PreLoaderFetchRes, ShopIngrListRecipeFetch, 
    ShopUnitListRecipeFetch } from "@/app/(main)/(main-list)/list-recipe/types";
import { ListIngrData } from "@/app/(main)/(main-list)/list/types";
import { createOperations, createOperationStatus, OperationState } from "@/app/types";
import { createAsyncThunk, createSlice,  PayloadAction } from "@reduxjs/toolkit";


export type OperationKey =
  | 'preLoaderMain'
  | 'newListRecipe'
  | 'ingredientsListRecipe'
  | 'shopIngrListRecipe'
  | 'deleteIngrRecipeList'
  | 'shopUnitListRecipe'
  | 'newAmountListRecipe'
  | 'newUnitListRecipe'
  | 'deleteUnitListRecipe'
  | 'deleteListRecipe'


const listOperationKeys: OperationKey[] = [
    'preLoaderMain',
    'newListRecipe',
    'ingredientsListRecipe',
    'shopIngrListRecipe',
    'deleteIngrRecipeList',
    'shopUnitListRecipe',
    'newAmountListRecipe',
    'newUnitListRecipe',
    'deleteUnitListRecipe',
    'deleteListRecipe'
];
  

interface ListRecipeState extends ListRecipeRootState {
    operations: OperationState<OperationKey>
}

const loadingStatus: OperationKey[] = [
    'newListRecipe',
    'shopIngrListRecipe',
    'shopUnitListRecipe',
];


const initialState: ListRecipeState = {
    connection_id: '',
    page:1,
    recipes: {}, 
    ingredients: {},
    units: {}, 
    operations:createOperations<OperationKey>(
        listOperationKeys,
        (key) =>
        loadingStatus.includes(key)
            ? createOperationStatus(false)
            : createOperationStatus()
    )
}

export const preLoaderMain = createAsyncThunk<PreLoaderFetchRes, PreLoaderFetchReq, { rejectValue: string }>(
    'listRecipe/preLoaderMain',
    async function ({connection_id, page}, { rejectWithValue }) {
        try {
            const urlList = `/api/list-recipe?connection_id=${connection_id}&page=${page}`
            const responseList = await fetch(urlList);

            if (!responseList.ok) return rejectWithValue('Server Error!');
            
            const dataList = await responseList.json()

            return dataList

        } catch (error) {
            console.log(error)
            return rejectWithValue('Request failed!');
        }
    }
)



export const newListRecipe = createAsyncThunk<ListRecipeData, NewListRecipeFetchReq, { rejectValue: string }>(
    'listRecipe/newListRecipe',
    async function (data, { rejectWithValue }) {
        try {
            // console.log(data)
            const urlList = `/api/list-recipe`
            const response = await fetch(urlList, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });


            if (!response.ok) return rejectWithValue('Server Error!');
            
            const dataList = await response.json()

            return dataList.data

        } catch (error) {
            console.log(error)
            return rejectWithValue('Request failed!');
        }
    }
)





export const ingredientsListRecipe = createAsyncThunk<IngrListRecipeFetchRes, IngrListRecipeFetchReq, { rejectValue: string }>(
    'listRecipe/ingredientsListRecipe',
    async function ({ connection_id, _id }, { rejectWithValue }) {
        try {
            const urlList = `/api/list-recipe/ingredients?connection_id=${connection_id}&_id=${_id}`
            const responseList = await fetch(urlList);

            if (!responseList.ok) return rejectWithValue('Server Error!');
            const dataList = await responseList.json()

            // console.log(dataList)
            return dataList

        } catch (error) {
            console.log(error)
            return rejectWithValue('Request failed!');
        }
    }
)


export const shopIngrListRecipe = createAsyncThunk<ShopIngrListRecipeFetch, ShopIngrListRecipeFetch, { rejectValue: string }>(
    'listRecipe/shopIngrListRecipe',
    async function (data, { rejectWithValue }) {
        try {
            const response = await fetch('/api/list-recipe/shop-ingredient', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
    
            if (!response.ok) {
                return rejectWithValue('Server Error!');
            }
            
            const dataList = await response.json()
            // console.log(dataList)

            return dataList;
        } catch (error) {
            console.log(error)
            return rejectWithValue('Request failed!');
        }
    }
)



export const deleteIngrRecipeList = createAsyncThunk<DeleteIngrListRecipeFetch, DeleteIngrListRecipeFetch, { rejectValue: string }>(
    'listRecipe/deleteIngrRecipeList',
    async function (data, { rejectWithValue }) {
        try {
            const response = await fetch('/api/list-recipe/ingredient-removal', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
    
            if (!response.ok) {
                return rejectWithValue('Server Error!');
            }
            
            const dataList = await response.json()

            return dataList;
        } catch (error) {
            console.log(error)
            return rejectWithValue('Request failed!');
        }
    }
)




export const shopUnitListRecipe = createAsyncThunk<ShopUnitListRecipeFetch, ShopUnitListRecipeFetch, { rejectValue: string }>(
    'listRecipe/shopUnitListRecipe',
    async function (data, { rejectWithValue }) {
        try {
            const response = await fetch('/api/list-recipe/shop-unit', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
    
            if (!response.ok) {
                return rejectWithValue('Server Error!');
            }
            
            const dataList = await response.json()
            // console.log(dataList)

            return dataList;
        } catch (error) {
            console.log(error)
            return rejectWithValue('Request failed!');
        }
    }
)



export const deleteUnitListRecipe = createAsyncThunk<DeleteUnitListRecipeFetch, DeleteUnitListRecipeFetch, { rejectValue: string }>(
    'listRecipe/deleteUnitListRecipe',
    async function (data, { rejectWithValue }) {
        try {
            const response = await fetch('/api/list-recipe/unit-removal', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
    
            if (!response.ok) {
                return rejectWithValue('Server Error!');
            }
            
            const dataList = await response.json()

            return dataList;
        } catch (error) {
            console.log(error)
            return rejectWithValue('Request failed!');
        }
    }
)



export const newAmountListRecipe = createAsyncThunk<ChangeAmountListRecipeFetch, ChangeAmountListRecipeFetch, { rejectValue: string }>(
    'listRecipe/newAmountListRecipe',
    async function (data, { rejectWithValue }) {
        try {
            const response = await fetch('/api/list-recipe/new-amount', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
    
            if (!response.ok) {
                return rejectWithValue('Server Error!');
            }
            
            const dataList = await response.json()

            return dataList;
        } catch (error) {
            console.log(error)
            return rejectWithValue('Request failed!');
        }
    }
)

export const newUnitListRecipe = createAsyncThunk<NewUnitListRecipeFetchRes, NewUnitListRecipeFetchReq, { rejectValue: string }>(
    'listRecipe/newUnitListRecipe',
    async function (data, { rejectWithValue }) {
        try {
            const response = await fetch('/api/list-recipe/new-unit', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
    
            if (!response.ok) {
                return rejectWithValue('Server Error!');
            }
            
            const dataList = await response.json()
            console.log('dataListdataListdataListdataList',dataList)
            return dataList;
        } catch (error) {
            console.log(error)
            return rejectWithValue('Request failed!');
        }
    }
)


export const deleteListRecipe = createAsyncThunk<string, DeleteListRecipeFetchReq, { rejectValue: string }>(
    'listRecipe/deleteListRecipe',
    async function (data, { rejectWithValue }) {
        try {
            const response = await fetch('/api/list-recipe', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
    
            if (!response.ok) {
                return rejectWithValue('Server Error!');
            }
            
            const dataList = await response.json()

            return dataList;
        } catch (error) {
            console.log(error)
            return rejectWithValue('Request failed!');
        }
    }
)


const createReducerHandlers = <T extends keyof ListRecipeState['operations']>(operationName: T) => ({
    pending: (state: ListRecipeState) => {
        state.operations[operationName].error = false;
        state.operations[operationName].loading = true;
    },
    rejected: (state: ListRecipeState) => {
        state.operations[operationName].error = true;
        state.operations[operationName].loading = false;
    }
});

const newListRecipeHandlers = createReducerHandlers('newListRecipe');
const preLoaderMainHandlers = createReducerHandlers('preLoaderMain');
const ingredientsListRecipeHandlers = createReducerHandlers('ingredientsListRecipe');
const shopIngrListRecipeHandlers = createReducerHandlers('shopIngrListRecipe');
const deleteIngrRecipeListHandlers = createReducerHandlers('deleteIngrRecipeList');
const shopUnitListRecipeHandlers = createReducerHandlers('shopUnitListRecipe');
const newAmountListRecipeHandlers = createReducerHandlers('newAmountListRecipe');
const newUnitListRecipeHandlers = createReducerHandlers('newUnitListRecipe');
const deleteUnitListRecipeHandlers = createReducerHandlers('deleteUnitListRecipe');
const deleteListRecipeHandlers = createReducerHandlers('deleteListRecipe');



const listRecipeSlice = createSlice({
    name: 'list-recipe',
    initialState,
    reducers: {

        closeAlertListRecipe(state, action: PayloadAction<OperationKey>){
            const key = action.payload

            if (state.operations[key]) {
                state.operations[key].error = false
                state.operations[key].loading = false
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(newListRecipe.pending, newListRecipeHandlers.pending)
            .addCase(newListRecipe.rejected, newListRecipeHandlers.rejected)
            .addCase(newListRecipe.fulfilled, (state, action: PayloadAction<ListRecipeData, string>) => {
                state.operations.newListRecipe.error = false;
                state.operations.newListRecipe.loading = false;

                const payload = action.payload;

                if (!state.recipes[payload._id]) {
                    state.recipes[payload._id] = payload;
                }
            })

           

            .addCase(preLoaderMain.pending, preLoaderMainHandlers.pending)
            .addCase(preLoaderMain.rejected, preLoaderMainHandlers.rejected)
            .addCase(preLoaderMain.fulfilled, (state, action: PayloadAction<PreLoaderFetchRes, string>) => {
                    state.operations.preLoaderMain.error = false;
                    state.operations.preLoaderMain.loading = false;

                    const payload = action.payload;
                    state.connection_id = payload.connection_id;
                    state.page = payload.page;

                    payload.recipe.forEach((recipe) => {
                    const recipeId = recipe._id;

                    if (!state.recipes[recipeId]) {
                        state.recipes[recipeId] = {
                            _id:recipe._id,
                            recipe_id: recipeId,
                            recipe_name: recipe.recipe_name,
                            recipe_media: recipe.recipe_media,
                            recipe_shop: recipe.recipe_shop,
                            ingredient_ids: [] 
                        };
                    }
                });
            })

           



            .addCase(ingredientsListRecipe.pending, ingredientsListRecipeHandlers.pending)
            .addCase(ingredientsListRecipe.rejected, ingredientsListRecipeHandlers.rejected)
            .addCase(ingredientsListRecipe.fulfilled, (state, action: PayloadAction<IngrListRecipeFetchRes, string>) => {
                state.operations.ingredientsListRecipe.error = false;
                state.operations.ingredientsListRecipe.loading = false;

                const payload = action.payload;
                state.connection_id = payload.connection_id;

                const recipe = state.recipes[payload._id];
                if (!recipe) {
                    return;
                }

                payload.ingredients.forEach(ingr => {
                    const unitIds: string[] = ingr.units.map(unit => {
                        state.units[unit._id] = {
                            unit_id: unit._id,
                            choice: unit.choice,
                            amount: unit.amount,
                            shop_unit: unit.shop_unit
                        };
                        return unit._id;
                    });

                    state.ingredients[ingr._id] = {
                        ingredient_id: ingr._id,
                        name: ingr.name,
                        media: ingr.media,
                        shop_ingr: ingr.shop_ingr,
                        list: ingr.list,
                        unit_ids: unitIds
                    };

                    if (!recipe.ingredient_ids.includes(ingr._id)) {
                        recipe.ingredient_ids.unshift(ingr._id);
                    }
                });
            })






            .addCase(shopIngrListRecipe.pending, shopIngrListRecipeHandlers.pending)
            .addCase(shopIngrListRecipe.rejected, shopIngrListRecipeHandlers.rejected)
            .addCase(shopIngrListRecipe.fulfilled, (state, action: PayloadAction<ShopIngrListRecipeFetch, string>) => {
                state.operations.shopIngrListRecipe.error = false;
                state.operations.shopIngrListRecipe.loading = false;

                const { ingredient_id, shop_ingr } = action.payload;

                if (state.ingredients[ingredient_id]) {
                    state.ingredients[ingredient_id].shop_ingr = shop_ingr;
                }
            })




            .addCase(deleteIngrRecipeList.pending, deleteIngrRecipeListHandlers.pending)
            .addCase(deleteIngrRecipeList.rejected, deleteIngrRecipeListHandlers.rejected)
            .addCase(deleteIngrRecipeList.fulfilled, (state, action: PayloadAction<DeleteIngrListRecipeFetch, string>) => {
                state.operations.deleteIngrRecipeList.error = false;
                state.operations.deleteIngrRecipeList.loading = false;

                const { _id, ingredient_id } = action.payload;

                const recipe = state.recipes[_id];
                if (recipe) {
                    recipe.ingredient_ids = recipe.ingredient_ids.filter(id => id !== ingredient_id);

                    state.ingredients = Object.fromEntries(
                        Object.entries(state.ingredients).filter(([id]) => id !== ingredient_id)
                    );
                }
            })




            .addCase(shopUnitListRecipe.pending, shopUnitListRecipeHandlers.pending)
            .addCase(shopUnitListRecipe.rejected, shopUnitListRecipeHandlers.rejected)
            .addCase(shopUnitListRecipe.fulfilled, (state, action: PayloadAction<ShopUnitListRecipeFetch, string>) => {
                state.operations.shopUnitListRecipe.error = false;
                state.operations.shopUnitListRecipe.loading = false;

                const { ingredient_id, unit_id, shop_unit, _id } = action.payload;

                const recipe = state.recipes[_id];
                if (recipe && recipe.ingredient_ids.includes(ingredient_id)) {
                    const unit = state.units[unit_id];
                    if (unit) {
                        unit.shop_unit = shop_unit;
                    }
                }
            })




            .addCase(newAmountListRecipe.pending, newAmountListRecipeHandlers.pending)
            .addCase(newAmountListRecipe.rejected, newAmountListRecipeHandlers.rejected)
            .addCase(newAmountListRecipe.fulfilled, (state, action: PayloadAction<ChangeAmountListRecipeFetch, string>) => {
                state.operations.newAmountListRecipe.error = false;
                state.operations.newAmountListRecipe.loading = false;

                const { ingredient_id, unit_id, amount, _id } = action.payload;

                const recipe = state.recipes[_id];
                if (recipe && recipe.ingredient_ids.includes(ingredient_id)) {
                    const unit = state.units[unit_id];
                    if (unit) {
                        unit.amount = amount;
                    }
                }
            })



            .addCase(newUnitListRecipe.pending, newUnitListRecipeHandlers.pending)
            .addCase(newUnitListRecipe.rejected, newUnitListRecipeHandlers.rejected)
            .addCase(newUnitListRecipe.fulfilled, (state, action: PayloadAction<NewUnitListRecipeFetchRes, string>) => {
                state.operations.newUnitListRecipe.error = false;
                state.operations.newUnitListRecipe.loading = false;

                const { ingredient_id, new_unit, _id } = action.payload;

                const recipe = state.recipes[_id];
                if (recipe && recipe.ingredient_ids.includes(ingredient_id)) {

                    const ingredient = state.ingredients[ingredient_id];
                    if (ingredient && !ingredient.unit_ids.includes(new_unit._id)) {
                        ingredient.unit_ids.push(new_unit._id);
                    }

                    state.units[new_unit._id] = {
                        unit_id: new_unit._id,
                        choice: new_unit.choice,
                        amount: new_unit.amount,
                        shop_unit: new_unit.shop_unit
                    };
                }
            })
            


            .addCase(deleteUnitListRecipe.pending, deleteUnitListRecipeHandlers.pending)
            .addCase(deleteUnitListRecipe.rejected, deleteUnitListRecipeHandlers.rejected)
            .addCase(deleteUnitListRecipe.fulfilled, (state, action: PayloadAction<DeleteUnitListRecipeFetch, string>) => {
                state.operations.deleteUnitListRecipe.error = false;
                state.operations.deleteUnitListRecipe.loading = false;

                const { ingredient_id, unit_id, _id } = action.payload;

                const recipe = state.recipes[_id];
                if (recipe && recipe.ingredient_ids.includes(ingredient_id)) {
                    const ingredient = state.ingredients[ingredient_id];
                    if (ingredient) {
                        ingredient.unit_ids = ingredient.unit_ids.filter(id => id !== unit_id);

                        state.units = Object.fromEntries(
                            Object.entries(state.units).filter(([id]) => id !== unit_id)
                        );
                    }
                }
            })



            .addCase(deleteListRecipe.pending, deleteListRecipeHandlers.pending)
            .addCase(deleteListRecipe.rejected, deleteListRecipeHandlers.rejected)
            .addCase(deleteListRecipe.fulfilled, (state, action: PayloadAction<string>) => {
                state.operations.deleteListRecipe.error = false;
                state.operations.deleteListRecipe.loading = false;

                const recipe_id = action.payload;

                state.recipes = Object.fromEntries(
                    Object.entries(state.recipes).filter(([id]) => id !== recipe_id)
                );
            });



           
    }
})

export const { closeAlertListRecipe } = listRecipeSlice.actions


export default listRecipeSlice.reducer
