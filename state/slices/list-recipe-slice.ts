import { IListObj, MainListRecipe, NewUnitObj, ResUnitObj, returnDataRecipeList, TempalteRecipeForList } from "@/app/types/types";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";




const initialState: MainListRecipe = {
    status: false,
    error: false,
    connection_id: '',
    page:0,
    recipes: []
}


interface NewListRecipeT {
    connection_id: string, 
    recipe_id: string
}

interface TempalteRecipeIngredient {
    ingredient_id:string, 
    connection_id:string, 
    recipe_id:string
}

interface ReturnPreLoaderMain {
    connection_id:string,
    page:number
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
            throw error
        }
    }
)





export const newListRecipe = createAsyncThunk<void, NewListRecipeT, { rejectValue: string }>(
    'listRecipe/newListRecipe',
    async function (data, { rejectWithValue }) {
        try {
            console.log(data)
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

            console.log(dataList)

        } catch (error) {
            console.log(error)
            throw error
        }
    }
)


interface ReturnIngredientsListrecipe {
    connection_id:string,
    recipe_id:string,
    ingredients:IListObj[]
}


export const ingredientsListRecipe = createAsyncThunk<ReturnIngredientsListrecipe, { connection_id: string, recipe_id: string }, { rejectValue: string }>(
    'listRecipe/ingredientsListRecipe',
    async function ({ connection_id, recipe_id }, { rejectWithValue }) {
        try {
            const urlList = `/api/list-recipe/ingredients?connection_id=${connection_id}&recipe_id=${recipe_id}`
            const responseList = await fetch(urlList);

            if (!responseList.ok) return rejectWithValue('Server Error!');
            const dataList = await responseList.json()

            console.log(dataList)
            return dataList

        } catch (error) {
            console.log(error)
            throw error
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
            console.log(dataList)

            return dataList;
        } catch (error) {
            console.log(error)
            throw error
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
            console.log(dataList)

            return dataList;
        } catch (error) {
            console.log(error)
            throw error
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
            console.log(dataList)

            return dataList;
        } catch (error) {
            console.log(error)
            throw error
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
            console.log(dataList)

            return dataList;
        } catch (error) {
            console.log(error)
            throw error
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
            throw error
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
            throw error
        }
    }
)


const listRecipeSlice = createSlice({
    name: 'list-recipe',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(preLoaderMain.pending, (state) => {
                state.status = true,
                state.error = false
            })
            .addCase(preLoaderMain.fulfilled, (state, action: PayloadAction<ReturnPreLoaderMain, string>) => {
                state.error = false,
                state.status = false
                // console.log(action.payload)
                const payload = action.payload
                state.connection_id = payload.connection_id
                state.page = payload.page


                payload.recipe.forEach((recipe) => {
                    if (!state.recipes.some(existingRecipe => existingRecipe.recipe_id === recipe.recipe_id)) {
                        state.recipes.push({
                            recipe_id: recipe.recipe_id,
                            recipe_name: recipe.recipe_name,
                            recipe_media: recipe.recipe_media, 
                            recipe_shop: recipe.recipe_shop,
                            ingredients_list: [] 
                        });
                    }
                });
            })


            .addCase(ingredientsListRecipe.pending, (state) => {
                state.status = true,
                state.error = false
            })
            .addCase(ingredientsListRecipe.fulfilled, (state, action: PayloadAction<ReturnIngredientsListrecipe, string>) => {
                state.error = false;
                state.status = false;
            
                const payload = action.payload;
            
                state.connection_id = payload.connection_id;
            
                if (payload.ingredients.length > 0) {
                    payload.ingredients.forEach(ingr => {
                        const existingRecipeIndex = state.recipes.findIndex(existingRecipe => existingRecipe.recipe_id === payload.recipe_id);
            
                        if (existingRecipeIndex !== -1) {
                            const existingRecipe = state.recipes[existingRecipeIndex];
                            
                            existingRecipe.ingredients_list.push(ingr);
                        }
                    });
                }
            })




            .addCase(shopIngrListRecipe.pending, (state) => {
                state.status = true,
                state.error = false
            })
            .addCase(shopIngrListRecipe.fulfilled, (state, action: PayloadAction<ShopIngrListRecipeT, string>) => {
                const { ingredient_id, shop_ingr, recipe_id } = action.payload;
                state.error = false,
                state.status = false

                const thisRecipe = state.recipes.find(el => el.recipe_id === recipe_id)

                if (thisRecipe) {
                    thisRecipe.ingredients_list.map(el => {
                        if (el._id === ingredient_id) {
                            el.shop_ingr = shop_ingr
                        }
                    })
                }

            })



            .addCase(deleteIngrRecipeList.pending, (state) => {
                state.status = true,
                state.error = false
            })
            .addCase(deleteIngrRecipeList.fulfilled, (state, action: PayloadAction<TempalteRecipeIngredient, string>) => {
                const { recipe_id, ingredient_id } = action.payload;
                state.error = false,
                state.status = false

                const recipeIndex = state.recipes.findIndex(recipe => recipe.recipe_id === recipe_id);

                if (recipeIndex !== -1) {
                    const ingredientsList = state.recipes[recipeIndex].ingredients_list.filter((ingredient: IListObj) => ingredient._id !== ingredient_id);
                    state.recipes[recipeIndex].ingredients_list = ingredientsList;
                }

            })



            .addCase(shopUnitListRecipe.pending, (state) => {
                state.status = true,
                state.error = false
            })
            .addCase(shopUnitListRecipe.fulfilled, (state, action: PayloadAction<ShopUnitIngredientT, string>) => {
                const { ingredient_id, unit_id, shop_unit, recipe_id  } = action.payload;
                state.error = false,
                state.status = false

                const recipe = state.recipes.find(recipe => recipe.recipe_id === recipe_id);
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



            .addCase(newAmountListRecipe.pending, (state) => {
                state.status = true,
                    state.error = false
            })
            .addCase(newAmountListRecipe.fulfilled, (state, action: PayloadAction<ChangeAmountT, string>) => {
                const { ingredient_id, unit_id, amount, recipe_id } = action.payload;
                state.error = false,
                state.status = false

                const recipe = state.recipes.find(recipe => recipe.recipe_id === recipe_id);
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


            .addCase(newUnitListRecipe.pending, (state) => {
                state.status = true,
                    state.error = false
            })
            .addCase(newUnitListRecipe.fulfilled, (state, action: PayloadAction<RespNewUnitIngreedient, string>) => {
                const { ingredient_id, new_unit, recipe_id } = action.payload;
                state.error = false,
                state.status = false

                const thisRecipe = state.recipes.find(el => el.recipe_id === recipe_id)
                if (thisRecipe) {
                    thisRecipe.ingredients_list.map(el => {
                        if (el._id === ingredient_id) {
                            el.units.push(new_unit)
                        }
                    })
                }

            })
            
    }
})



export default listRecipeSlice.reducer
