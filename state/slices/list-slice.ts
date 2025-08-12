import { ChangeAmountFetch, DeleteUnitIngrFetch, ListFetchReq, ListFetchRes, 
    ListRootState, 
    NewIngrFetchReq, NewIngrFetchRes, NewUnitFetchReq, NewUnitFetchRes, NewUnitIngrFetchReq,
    NewUnitIngrFetchRes, ShopIngrFetch, ShopUnitFetch, UpdCookUnitFetch } from "@/app/(main)/(main-list)/list/types";
import { createOperations, createOperationStatus, OperationState } from "@/app/types";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";






export type ListOperationKey =
  | 'fetchList'
  | 'newIngredientList'
  | 'newUnitIngredientList'
  | 'updateCookUnit'
  | 'toggleShopIngrFetch'
  | 'shopUnitUpdate'
  | 'deleteIngredientFetch'
  | 'deleteUnitIngrFetch'
  | 'changeAmountFetch'
  | 'addNewUnit'



const listOperationKeys: ListOperationKey[] = [
    'fetchList',
    'newIngredientList',
    'newUnitIngredientList',
    'updateCookUnit',
    'toggleShopIngrFetch',
    'shopUnitUpdate',
    'deleteIngredientFetch',
    'deleteUnitIngrFetch',
    'changeAmountFetch',
    'addNewUnit'
];


interface ListState extends ListRootState {
    operations: OperationState<ListOperationKey>
}


const loadingStatus: ListOperationKey[] = [
    'newIngredientList',
    'newUnitIngredientList',
    'updateCookUnit',
    'toggleShopIngrFetch',
    'shopUnitUpdate'
];



const initialState: ListState = {
    connection_id: '',
    page_list: 1,
    ingredients:{},
    units:{},
    operations:createOperations<ListOperationKey>(
        listOperationKeys,
        (key) =>
        loadingStatus.includes(key)
            ? createOperationStatus(false)
            : createOperationStatus()
    )
}


export const fetchList = createAsyncThunk<ListFetchRes, ListFetchReq, { rejectValue: string }>(
    'list/fetchList',
    async function (data, { rejectWithValue }) {
        try {
            const urlList = `/api/list?connection_id=${data.id}&page_list=${data.page_list}`
            const responseList = await fetch(urlList);

            if (!responseList.ok) return rejectWithValue('Server Error!');

            const dataList = await responseList.json()

            return dataList.data

        } catch (error) {
            console.log(error)
            return rejectWithValue('Request failed!');
        }
    }
)


export const newIngredientList = createAsyncThunk<NewIngrFetchRes, NewIngrFetchReq, { rejectValue: string }>(
    'list/newIngredientList',
    async function (reqData, { rejectWithValue }) {
        try {
            // console.log(reqData)
            const response = await fetch('/api/list/cook-ingredient', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reqData)
            });

            if (!response.ok) {
                return rejectWithValue('Server Error!');
            }

            const data = await response.json()

            return data;
        } catch (error) {
            console.log(error);
            return rejectWithValue('Request failed!');
        }
    }
);



export const newUnitIngredientList = createAsyncThunk<NewUnitIngrFetchRes, NewUnitIngrFetchReq, { rejectValue: string }>(
    'list/newUnitIngredientList',
    async function (reqData, { rejectWithValue }) {
        try {
            const response = await fetch('/api/list/cook-ingredient', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reqData)
            });

            if (!response.ok) {
                return rejectWithValue('Server Error!');
            }

            const data = await response.json()
            return data;

        } catch (error) {
            console.log(error);
            return rejectWithValue('Request failed!');
        }
    }
);


export const updateCookUnit = createAsyncThunk<UpdCookUnitFetch, UpdCookUnitFetch, { rejectValue: string }>(
    'list/updateCookUnit',
    async function (data, { rejectWithValue }) {
        try {
            
            const response = await fetch('/api/list/cook-amount', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                return rejectWithValue('Server Error!');
            }

            return data;

        } catch (error) {
            console.log(error);
            return rejectWithValue('Request failed!');
        }
    }
);



export const toggleShopIngrFetch = createAsyncThunk<ShopIngrFetch, ShopIngrFetch, { rejectValue: string }>(
    'list/toggleShopIngrFetch',
    async function (data, { rejectWithValue }) {
        try {
            const response = await fetch('/api/list/shop-ingredient', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
    
            if (!response.ok) {
                return rejectWithValue('Server Error!');
            }
    
            return data;
        } catch (error) {
            console.log(error)
            return rejectWithValue('Request failed!');
        }
    }
);



export const shopUnitUpdate = createAsyncThunk<ShopUnitFetch, ShopUnitFetch, { rejectValue: string }>(
    'list/toggleUnitFetch',
    async function (data, { rejectWithValue }) {
        try {
            const response = await fetch('/api/list/shop-unit', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
    
            if (!response.ok) {
                return rejectWithValue('Server Error!');
            }
    
            return data;
    
        } catch (error) {
            console.log(error);
            return rejectWithValue('Request failed!');
        }
    }
);

export const deleteIngredientFetch = createAsyncThunk<{_id:string}, {_id:string}, { rejectValue: string }>(
    'list/deleteIngredientFetch',
    async function (data, { rejectWithValue }) {
        try {
            const response = await fetch('/api/list', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
    
            if (!response.ok) {
                return rejectWithValue('Server Error!');
            }
    
            return data;
    
        } catch (error) {
            console.log(error);
            return rejectWithValue('Request failed!');
        }
    }
)



export const deleteUnitIngrFetch = createAsyncThunk<DeleteUnitIngrFetch, DeleteUnitIngrFetch, { rejectValue: string }>(
    'list/deleteUnitIngrFetch',
    async function (data, { rejectWithValue }) {

        try {
            const response = await fetch('/api/list/unit-removal', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
    
            if (!response.ok) {
                return rejectWithValue('Server Error!');
            }
    
            return data;
    
        } catch (error) {
            console.log(error);
            return rejectWithValue('Request failed!');
        }
    }
);



export const changeAmountFetch = createAsyncThunk<ChangeAmountFetch, ChangeAmountFetch, { rejectValue: string }>(
    'list/changeAmountFetch',
    async function (data, { rejectWithValue }) {
        try {
            
            const response = await fetch('/api/list/amount', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
    
            if (!response.ok) {
                return rejectWithValue('Server Error!');
            }
    
            const listData = await response.json()

            return listData;
    
        } catch (error) {
            console.log(error);
            return rejectWithValue('Request failed!');
        }
    }
);



export const addNewUnit = createAsyncThunk<NewUnitFetchRes, NewUnitFetchReq, { rejectValue: string }>(
    'list/addNewUnit',
    async function (data, { rejectWithValue }) {

        try {
            const response = await fetch('/api/list/new-unit', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
    
            if (!response.ok) {
                return rejectWithValue('Server Error!');
            }
            const respData = await response.json()

            return respData;
    
        } catch (error) {
            console.log(error);
            return rejectWithValue('Request failed!');
        }
    }
);



const createReducerHandlers = <T extends keyof ListState['operations']>(operationName: T) => ({
    pending: (state: ListState) => {
        state.operations[operationName].error = false;
        state.operations[operationName].loading = true;
    },
    rejected: (state: ListState) => {
        state.operations[operationName].error = true;
        state.operations[operationName].loading = false;
    }
});



const fetchListHandlers = createReducerHandlers('fetchList');
const newIngredientListHandlers = createReducerHandlers('newIngredientList');
const newUnitIngredientListHandlers = createReducerHandlers('newUnitIngredientList');
const updateCookUnitHandlers = createReducerHandlers('updateCookUnit');
const toggleShopIngrFetchHandlers = createReducerHandlers('toggleShopIngrFetch');
const shopUnitUpdateHandlers = createReducerHandlers('shopUnitUpdate');
const deleteIngredientFetchHandlers = createReducerHandlers('deleteIngredientFetch');
const deleteUnitIngrFetchHandlers = createReducerHandlers('deleteUnitIngrFetch');
const changeAmountFetchHandlers = createReducerHandlers('changeAmountFetch');
const addNewUnitHandlers = createReducerHandlers('addNewUnit');


const listSlice = createSlice({
    name: 'list',
    initialState,
    reducers: {
        closeAlertList(state, action: PayloadAction<ListOperationKey>){
            const key = action.payload

            if (state.operations[key]) {
                state.operations[key].error = false
                state.operations[key].loading = false
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchList.pending, fetchListHandlers.pending)
            .addCase(fetchList.rejected, fetchListHandlers.rejected)
            .addCase(fetchList.fulfilled, (state, action: PayloadAction<ListFetchRes, string>) => {
                state.operations.fetchList.error = false
                state.operations.fetchList.loading = false
                
                const payload = action.payload;
                state.connection_id = payload.connection_id;
                state.page_list = payload.page_list;

                payload.list_ingr.forEach((el) => {
                    if (!state.ingredients[el._id]) {
                        state.ingredients[el._id] = {
                            ingredient_id: el._id,
                            name: el.name,
                            media: el.media,
                            shop_ingr: el.shop_ingr,
                            list: el.list,
                            unit_ids: el.units.map(unit => unit._id),
                        };
                    }

                    el.units.forEach((unit) => {
                        if (!state.units[unit._id]) {
                            state.units[unit._id] = {
                                unit_id: unit._id,
                                choice: unit.choice,
                                amount: unit.amount,
                                shop_unit: unit.shop_unit,
                            };
                        }
                    });
                });

            })


            .addCase(newIngredientList.pending, newIngredientListHandlers.pending)
            .addCase(newIngredientList.rejected, newIngredientListHandlers.rejected)
            .addCase(newIngredientList.fulfilled, (state, action: PayloadAction<NewIngrFetchRes, string>) => {
                state.operations.newIngredientList.error = false;
                state.operations.newIngredientList.loading = false;

                const data = action.payload;

                const existing = state.ingredients[data._id];
                if (!existing) {
                    state.ingredients[data._id] = {
                        ingredient_id: data._id,
                        name: data.name,
                        media: data.media,
                        shop_ingr: data.shop_ingr,
                        list: data.list,
                        unit_ids: data.units.map(unit => unit.unit_id),
                    };

                    data.units.forEach(unit => {
                        state.units[unit.unit_id] = unit;
                    });
                }
            })



            .addCase(newUnitIngredientList.pending, newUnitIngredientListHandlers.pending)
            .addCase(newUnitIngredientList.rejected, newUnitIngredientListHandlers.rejected)
            .addCase(newUnitIngredientList.fulfilled, (state, action: PayloadAction<NewUnitIngrFetchRes, string>) => {
                state.operations.newUnitIngredientList.error = false;
                state.operations.newUnitIngredientList.loading = false;

                const { unit, _id } = action.payload;

                const ingredient = state.ingredients[_id];
                if (ingredient) {
                    state.units[unit.unit_id] = unit;

                    if (!ingredient.unit_ids.includes(unit.unit_id)) {
                        ingredient.unit_ids.push(unit.unit_id);
                    }
                }
            })



            .addCase(updateCookUnit.pending, updateCookUnitHandlers.pending)
            .addCase(updateCookUnit.rejected, updateCookUnitHandlers.rejected)
            .addCase(updateCookUnit.fulfilled, (state, action: PayloadAction<UpdCookUnitFetch, string>) => {
                state.operations.updateCookUnit.error = false;
                state.operations.updateCookUnit.loading = false;

                const { name, amount, _id } = action.payload;

                const ingredient = Object.values(state.ingredients).find(ingr => ingr.name === name);

                if (ingredient && ingredient.unit_ids.includes(_id)) {
                    const unit = state.units[_id];
                    if (unit) {
                        unit.amount = amount;
                    }
                }
            })




            .addCase(toggleShopIngrFetch.pending, toggleShopIngrFetchHandlers.pending)
            .addCase(toggleShopIngrFetch.rejected, toggleShopIngrFetchHandlers.rejected)
            .addCase(toggleShopIngrFetch.fulfilled, (state, action: PayloadAction<ShopIngrFetch, string>) => {
                state.operations.toggleShopIngrFetch.error = false;
                state.operations.toggleShopIngrFetch.loading = false;

                const { _id, shop_ingr } = action.payload;

                const ingredient = state.ingredients[_id];
                if (ingredient) {
                    ingredient.shop_ingr = !shop_ingr;
                }
            })



            .addCase(shopUnitUpdate.pending, shopUnitUpdateHandlers.pending)
            .addCase(shopUnitUpdate.rejected, shopUnitUpdateHandlers.rejected)
            .addCase(shopUnitUpdate.fulfilled, (state, action: PayloadAction<ShopUnitFetch, string>) => {
                state.operations.shopUnitUpdate.error = false;
                state.operations.shopUnitUpdate.loading = false;
                
                const { ingredient_id, unit_id, shop_unit } = action.payload;
                
                if (state.ingredients[ingredient_id]) {
                    if (state.units[unit_id] && state.ingredients[ingredient_id].unit_ids.includes(unit_id)) {
                        state.units[unit_id].shop_unit = !shop_unit;
                    }
                }
            })



            .addCase(deleteIngredientFetch.pending, deleteIngredientFetchHandlers.pending)
            .addCase(deleteIngredientFetch.rejected, deleteIngredientFetchHandlers.rejected)
            .addCase(deleteIngredientFetch.fulfilled, (state, action: PayloadAction<{ _id: string }, string>) => {
                state.operations.deleteIngredientFetch.error = false;
                state.operations.deleteIngredientFetch.loading = false;

                const { _id } = action.payload;

                const ingredient = state.ingredients[_id];
                if (ingredient) {
                    const unitsToRemove = new Set(ingredient.unit_ids);

                    state.units = Object.fromEntries(
                    Object.entries(state.units)
                        .filter(([unitId]) => !unitsToRemove.has(unitId))
                    );

                    state.ingredients = Object.fromEntries(
                    Object.entries(state.ingredients)
                        .filter(([ingredientId]) => ingredientId !== _id)
                    );
                }
            })





            .addCase(deleteUnitIngrFetch.pending, deleteUnitIngrFetchHandlers.pending)
            .addCase(deleteUnitIngrFetch.rejected, deleteUnitIngrFetchHandlers.rejected)
            .addCase(deleteUnitIngrFetch.fulfilled, (state, action: PayloadAction<DeleteUnitIngrFetch, string>) => {
                state.operations.deleteUnitIngrFetch.error = false;
                state.operations.deleteUnitIngrFetch.loading = false;

                const { ingredient_id, unit_id } = action.payload;

                const ingredient = state.ingredients[ingredient_id];
                if (ingredient) {
                    ingredient.unit_ids = ingredient.unit_ids.filter(id => id !== unit_id);
                }

                state.units = Object.fromEntries(
                    Object.entries(state.units).filter(([key]) => key !== unit_id)
                );
            })



            .addCase(changeAmountFetch.pending, changeAmountFetchHandlers.pending)
            .addCase(changeAmountFetch.rejected, changeAmountFetchHandlers.rejected)
            .addCase(changeAmountFetch.fulfilled, (state, action: PayloadAction<ChangeAmountFetch, string>) => {
                state.operations.changeAmountFetch.error = false;
                state.operations.changeAmountFetch.loading = false;

                const { ingredient_id, unit_id, amount } = action.payload;

                const ingredient = state.ingredients[ingredient_id];
                const unitExists = ingredient?.unit_ids.includes(unit_id);
                const unit = state.units[unit_id];

                if (ingredient && unitExists && unit) {
                    unit.amount = amount;
                }
            })




            .addCase(addNewUnit.pending, addNewUnitHandlers.pending)
            .addCase(addNewUnit.rejected, addNewUnitHandlers.rejected)
            .addCase(addNewUnit.fulfilled, (state, action: PayloadAction<NewUnitFetchRes, string>) => {
                state.operations.addNewUnit.error = false;
                state.operations.addNewUnit.loading = false;

                const { ingredient_id, new_unit } = action.payload;

                const ingredient = state.ingredients[ingredient_id];
                if (ingredient) {
                    state.units[new_unit.unit_id] = new_unit;

                    if (!ingredient.unit_ids.includes(new_unit.unit_id)) {
                        ingredient.unit_ids.push(new_unit.unit_id);
                    }
                }
            })

        }
})
    

export const { closeAlertList } = listSlice.actions

    
export default listSlice.reducer