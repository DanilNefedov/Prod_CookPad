import { IListObj, MainListRecipe, NewUnitObj, ResUnitObj, TempalteRecipeForList } from "@/app/types/types";
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


type OperationStatus = {
    loading: boolean
    error: boolean
}

type OperationState = Record<OperationKey, OperationStatus>

interface ListrecipeState extends MainListRecipe {
    operations: OperationState
}

const defaultStatus: OperationStatus = { loading: true, error: false }
const loadingStatus: OperationStatus = { loading: false, error: false }

const initialState: ListrecipeState = {
    status: true,
    error: false,
    connection_id: '',
    page:1,
    recipes: [],
    operations:{
        preLoaderMain: defaultStatus,
        newListRecipe: loadingStatus,
        ingredientsListRecipe: defaultStatus,
        shopIngrListRecipe:loadingStatus,
        deleteIngrRecipeList:defaultStatus,
        shopUnitListRecipe:loadingStatus,
        newAmountListRecipe:defaultStatus,
        newUnitListRecipe:defaultStatus,
        deleteUnitListRecipe:defaultStatus,
        deleteListRecipe:defaultStatus,
    },
}


interface NewListRecipeT {
    connection_id: string, 
    recipe_id: string
}

interface TempalteRecipeIngredient {
    ingredient_id:string, 
    connection_id:string, 
    _id:string
}

interface ReturnPreLoaderMain {
    connection_id:string,
    page:number | null
    recipe:TempalteRecipeForList[]
}

export const preLoaderMain = createAsyncThunk<ReturnPreLoaderMain, {connection_id:string, page:number}, { rejectValue: string }>(
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





export const newListRecipe = createAsyncThunk<TempalteRecipeForList, NewListRecipeT, { rejectValue: string }>(
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


interface ReturnIngredientsListrecipe {
    connection_id:string,
    _id:string,
    ingredients:IListObj[]
}


export const ingredientsListRecipe = createAsyncThunk<ReturnIngredientsListrecipe, { connection_id: string, _id: string }, { rejectValue: string }>(
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

interface ShopIngrListRecipeT extends TempalteRecipeIngredient{ 
    shop_ingr: boolean, 
}

export const shopIngrListRecipe = createAsyncThunk<ShopIngrListRecipeT, ShopIngrListRecipeT, { rejectValue: string }>(
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



export const deleteIngrRecipeList = createAsyncThunk<TempalteRecipeIngredient, TempalteRecipeIngredient, { rejectValue: string }>(
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


interface ShopUnitIngredientT extends TempalteRecipeIngredient{
    unit_id:string,
    shop_unit:boolean
}

export const shopUnitListRecipe = createAsyncThunk<ShopUnitIngredientT, ShopUnitIngredientT, { rejectValue: string }>(
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


interface DeleteUnitIngredientT extends TempalteRecipeIngredient{
    unit_id:string
}


export const deleteUnitListRecipe = createAsyncThunk<DeleteUnitIngredientT, DeleteUnitIngredientT, { rejectValue: string }>(
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



interface ChangeAmountT extends TempalteRecipeIngredient{
    unit_id: string, 
    amount: number
}

export const newAmountListRecipe = createAsyncThunk<ChangeAmountT, ChangeAmountT, { rejectValue: string }>(
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
interface NewUnitIngredient extends TempalteRecipeIngredient{
    updated_unit:NewUnitObj
}

interface RespNewUnitIngreedient extends TempalteRecipeIngredient {
    new_unit:ResUnitObj
}

export const newUnitListRecipe = createAsyncThunk<RespNewUnitIngreedient, NewUnitIngredient, { rejectValue: string }>(
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

            return dataList;
        } catch (error) {
            console.log(error)
            return rejectWithValue('Request failed!');
        }
    }
)


export const deleteListRecipe = createAsyncThunk<string, {connection_id:string, recipe_id:string}, { rejectValue: string }>(
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


const createReducerHandlers = <T extends keyof ListrecipeState['operations']>(operationName: T) => ({
    pending: (state: ListrecipeState) => {
        state.operations[operationName].error = false;
        state.operations[operationName].loading = true;
    },
    rejected: (state: ListrecipeState) => {
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
            .addCase(newListRecipe.fulfilled, (state, action: PayloadAction<TempalteRecipeForList, string>) => {
                state.operations.newListRecipe.error = false
                state.operations.newListRecipe.loading = false

                const payload = action.payload
                
                const alreadyExists = state.recipes.some(recipe => recipe._id === payload._id);

                if (!alreadyExists) {
                    state.recipes.push(payload);
                }

            })
           

            .addCase(preLoaderMain.pending, preLoaderMainHandlers.pending)
            .addCase(preLoaderMain.rejected, preLoaderMainHandlers.rejected)
            .addCase(preLoaderMain.fulfilled, (state, action: PayloadAction<ReturnPreLoaderMain, string>) => {
                state.operations.preLoaderMain.error = false
                state.operations.preLoaderMain.loading = false
                console.log(action.payload)
                const payload = action.payload
                state.connection_id = payload.connection_id
                


                payload.recipe.forEach((recipe) => {
                    if (!state.recipes.some(existingRecipe => existingRecipe._id === recipe._id)) {
                        state.recipes.push({
                            _id:recipe._id,
                            recipe_id: recipe.recipe_id,
                            recipe_name: recipe.recipe_name,
                            recipe_media: recipe.recipe_media, 
                            recipe_shop: recipe.recipe_shop,
                            ingredients_list: [] 
                        });
                    }
                });
                
                
                state.page = payload.page
            })
           



            .addCase(ingredientsListRecipe.pending, ingredientsListRecipeHandlers.pending)
            .addCase(ingredientsListRecipe.rejected, ingredientsListRecipeHandlers.rejected)
            .addCase(ingredientsListRecipe.fulfilled, (state, action: PayloadAction<ReturnIngredientsListrecipe, string>) => {
                state.operations.ingredientsListRecipe.error = false
                state.operations.ingredientsListRecipe.loading = false

                const payload = action.payload;
                state.connection_id = payload.connection_id;
            
                if (payload.ingredients.length > 0) {
                    payload.ingredients.forEach(ingr => {
                        const existingRecipeIndex = state.recipes.findIndex(existingRecipe => existingRecipe._id === payload._id);
            
                        if (existingRecipeIndex !== -1) {
                            const existingRecipe = state.recipes[existingRecipeIndex];
                            
                            existingRecipe.ingredients_list.unshift(ingr);
                        }
                    });
                } 
            })




            .addCase(shopIngrListRecipe.pending, shopIngrListRecipeHandlers.pending)
            .addCase(shopIngrListRecipe.rejected, shopIngrListRecipeHandlers.rejected)
            .addCase(shopIngrListRecipe.fulfilled, (state, action: PayloadAction<ShopIngrListRecipeT, string>) => {
                state.operations.shopIngrListRecipe.error = false
                state.operations.shopIngrListRecipe.loading = false
                
                const { ingredient_id, shop_ingr, _id } = action.payload;
                const thisRecipe = state.recipes.find(el => el._id === _id)

                if (thisRecipe) {
                    thisRecipe.ingredients_list.map(el => {
                        if (el._id === ingredient_id) {
                            el.shop_ingr = shop_ingr
                        }
                    })
                }

            })



            .addCase(deleteIngrRecipeList.pending, deleteIngrRecipeListHandlers.pending)
            .addCase(deleteIngrRecipeList.rejected, deleteIngrRecipeListHandlers.rejected)
            .addCase(deleteIngrRecipeList.fulfilled, (state, action: PayloadAction<TempalteRecipeIngredient, string>) => {
                state.operations.deleteIngrRecipeList.error = false
                state.operations.deleteIngrRecipeList.loading = false
                
                const { _id, ingredient_id } = action.payload;
                const recipeIndex = state.recipes.findIndex(recipe => recipe._id === _id);

                if (recipeIndex !== -1) {
                    const ingredientsList = state.recipes[recipeIndex].ingredients_list.filter((ingredient: IListObj) => ingredient._id !== ingredient_id);
                    state.recipes[recipeIndex].ingredients_list = ingredientsList;
                }

            })



            .addCase(shopUnitListRecipe.pending, shopUnitListRecipeHandlers.pending)
            .addCase(shopUnitListRecipe.rejected, shopUnitListRecipeHandlers.rejected)
            .addCase(shopUnitListRecipe.fulfilled, (state, action: PayloadAction<ShopUnitIngredientT, string>) => {
                state.operations.shopUnitListRecipe.error = false
                state.operations.shopUnitListRecipe.loading = false
                
                const { ingredient_id, unit_id, shop_unit, _id  } = action.payload;
                const recipe = state.recipes.find(recipe => recipe._id === _id);

                if (recipe) {
                    const ingredient = recipe.ingredients_list.find(ingredient => ingredient._id === ingredient_id);
                    if (ingredient) {
                        const unit = ingredient.units.find(unit => unit._id === unit_id);
                        if (unit) {
                            unit.shop_unit = shop_unit;
                        }
                    }
                }

            })



            .addCase(newAmountListRecipe.pending, newAmountListRecipeHandlers.pending)
            .addCase(newAmountListRecipe.rejected, newAmountListRecipeHandlers.rejected)
            .addCase(newAmountListRecipe.fulfilled, (state, action: PayloadAction<ChangeAmountT, string>) => {
                state.operations.newAmountListRecipe.error = false
                state.operations.newAmountListRecipe.loading = false
                
                const { ingredient_id, unit_id, amount, _id } = action.payload;
                const recipe = state.recipes.find(recipe => recipe._id === _id);

                if (recipe) {
                    const ingredient = recipe.ingredients_list.find(ingredient => ingredient._id === ingredient_id);
                    if (ingredient) {
                        const unit = ingredient.units.find(unit => unit._id === unit_id);
                        if (unit) {
                            unit.amount = amount;
                        }
                    }
                }

            })


            .addCase(newUnitListRecipe.pending, newUnitListRecipeHandlers.pending)
            .addCase(newUnitListRecipe.rejected, newUnitListRecipeHandlers.rejected)
            .addCase(newUnitListRecipe.fulfilled, (state, action: PayloadAction<RespNewUnitIngreedient, string>) => {
                state.operations.newUnitListRecipe.error = false
                state.operations.newUnitListRecipe.loading = false
                
                const { ingredient_id, new_unit, _id } = action.payload;
                const thisRecipe = state.recipes.find(el => el._id === _id)

                if (thisRecipe) {
                    thisRecipe.ingredients_list.map(el => {
                        if (el._id === ingredient_id) {
                            el.units.push(new_unit)
                        }
                    })
                }

            })



            .addCase(deleteUnitListRecipe.pending, deleteUnitListRecipeHandlers.pending)
            .addCase(deleteUnitListRecipe.rejected, deleteUnitListRecipeHandlers.rejected)
            .addCase(deleteUnitListRecipe.fulfilled, (state, action: PayloadAction<DeleteUnitIngredientT, string>) => {
                state.operations.deleteUnitListRecipe.error = false
                state.operations.deleteUnitListRecipe.loading = false
                
                const { ingredient_id, connection_id: id, unit_id, _id } = action.payload;
                const recipe = state.recipes.find(r => r._id === _id);

                if (recipe) {
                    const ingredient = recipe.ingredients_list.find(el => el._id === ingredient_id);
                    if (ingredient) {
                        ingredient.units = ingredient.units.filter(unit => unit._id !== unit_id);
                    }
                }

            })


            .addCase(deleteListRecipe.pending, deleteListRecipeHandlers.pending)
            .addCase(deleteListRecipe.rejected, deleteListRecipeHandlers.rejected)
            .addCase(deleteListRecipe.fulfilled, (state, action: PayloadAction<string>) => {
                state.operations.deleteListRecipe.error = false
                state.operations.deleteListRecipe.loading = false
                
                const recipe_id = action.payload;

                state.recipes = state.recipes.filter(recipe => recipe._id !== recipe_id);
            })


           
    }
})

export const { closeAlertListRecipe } = listRecipeSlice.actions


export default listRecipeSlice.reducer
