import { IListState, IngredientFullData, IRequestList, NewUnitIngredient, NewUnitObj, ResUnitObj } from "@/app/types/types";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";







export type listOperationKey =
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






type OperationStatus = {
    loading: boolean
    error: boolean
}

type OperationState = Record<listOperationKey, OperationStatus>

interface ListState extends IListState {
    operations: OperationState
}

const defaultStatus: OperationStatus = { loading: true, error: false }
const loadingStatus: OperationStatus = { loading: false, error: false }




const initialState: ListState = {
    status: true,
    error: false,
    connection_id: '',
    page_list: 1,
    list_ingr: [
    ],
    operations:{
        fetchList:defaultStatus,
        newIngredientList:loadingStatus,
        newUnitIngredientList:loadingStatus,
        updateCookUnit:loadingStatus,
        toggleShopIngrFetch:defaultStatus,
        shopUnitUpdate:defaultStatus,
        deleteIngredientFetch:defaultStatus,
        deleteUnitIngrFetch:defaultStatus,
        changeAmountFetch:defaultStatus,
        addNewUnit:defaultStatus,
    }
}


interface NewIngredientListT {
    connection_id:string,
    name:string,
    media:string,
    shop_ingr:boolean
    units:NewUnitObj[]
    list:string[]
}

interface ResNewIngredientListT {
    _id:string,
    name:string,
    media:string,
    shop_ingr:boolean
    units:ResUnitObj[]
    list:string[]
}



interface ReqDataUpdateUnit {
    connection_id: string,
    name: string,
    units: NewUnitObj,
}
interface ResDataUnitUpdate{
    unit:ResUnitObj
    _id:string
}



interface updateCookUnitI {
    name:string,
    connection_id: string,
    _id: string,
    amount: number,
}


interface RerturnFetchData extends IRequestList {
    page_list:number | null
}

export const fetchList = createAsyncThunk<RerturnFetchData, {id:string, page_list:number}, { rejectValue: string }>(
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
            throw error
        }
    }
)
export const newIngredientList = createAsyncThunk<ResNewIngredientListT, NewIngredientListT, { rejectValue: string }>(
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
            throw error;
        }
    }
);




// export const newUnitCookPage = createAsyncThunk<returnNewUnit | returnNewIngredient, newUnitCookPageI, { rejectValue: string }>(
export const newUnitIngredientList = createAsyncThunk<ResDataUnitUpdate, ReqDataUpdateUnit, { rejectValue: string }>(
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
            throw error;
        }
    }
);


export const updateCookUnit = createAsyncThunk<updateCookUnitI, updateCookUnitI, { rejectValue: string }>(
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
            throw error;
        }
    }
);

interface ShopIngredientT {
    _id:string, 
    shop_ingr:boolean
}

export const toggleShopIngrFetch = createAsyncThunk<ShopIngredientT, ShopIngredientT, { rejectValue: string }>(
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
            throw error
        }
    }
);

interface ShopUnitUpdateT {
    ingredient_id: string
    unit_id:string
    shop_unit:boolean
}

export const shopUnitUpdate = createAsyncThunk<ShopUnitUpdateT, ShopUnitUpdateT, { rejectValue: string }>(
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
            throw error;
        }
    }
);

interface DeleteIngredientT{
    _id:string
}

export const deleteIngredientFetch = createAsyncThunk<DeleteIngredientT, DeleteIngredientT, { rejectValue: string }>(
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
            throw error;
        }
    }
)


interface DeleteUnitIngredientT{
    ingredient_id:string, 
    unit_id:string 
}

export const deleteUnitIngrFetch = createAsyncThunk<DeleteUnitIngredientT, DeleteUnitIngredientT, { rejectValue: string }>(
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
            throw error;
        }
    }
);


interface ChangeAmountT {
    ingredient_id:string,
    unit_id:string,
    amount:number
}


export const changeAmountFetch = createAsyncThunk<ChangeAmountT, ChangeAmountT, { rejectValue: string }>(
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
            console.log(listData)
            return listData;
    
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
);



interface AddNewUnitT {
    ingredient_id:string,
    new_unit:NewUnitObj
}

interface ResAddNewUnitT {
    ingredient_id:string,
    new_unit:ResUnitObj
}

export const addNewUnit = createAsyncThunk<ResAddNewUnitT, AddNewUnitT, { rejectValue: string }>(
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
            // console.log(respData)
            return respData;
    
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
);



const createReducerHandlers = <T extends keyof ListState['operations']>(operationName: T) => ({
    pending: (state: ListState) => {
        state.operations[operationName].error = false;
        state.operations[operationName].loading = true;
    },
    rejected: (state: ListState) => {
        console.log('3')
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
        closeAlertList(state, action: PayloadAction<listOperationKey>){
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
            .addCase(fetchList.fulfilled, (state, action: PayloadAction<RerturnFetchData, string>) => {
                state.operations.fetchList.error = false
                state.operations.fetchList.loading = false
                
                const payload = action.payload
                state.connection_id = payload.connection_id

                payload.list_ingr.map(el => {
                    const findThisIngr = state.list_ingr.find(elem => (elem._id === el._id))

                    if (!findThisIngr) {
                        state.list_ingr.push(el)
                    }
                })

                state.page_list = payload.page_list

            })


            .addCase(newIngredientList.pending, newIngredientListHandlers.pending)
            .addCase(newIngredientList.rejected, newIngredientListHandlers.rejected)
            .addCase(newIngredientList.fulfilled, (state, action:PayloadAction<ResNewIngredientListT, string>) => {
                state.operations.newIngredientList.error = false
                state.operations.newIngredientList.loading = false

                const data = action.payload;

                const thisIngr = state.list_ingr.find(el => el._id === data._id)
                if(state.list_ingr.length > 0 && !thisIngr){
                    state.list_ingr.push(data)
                    

                }
            })


            .addCase(newUnitIngredientList.pending, newUnitIngredientListHandlers.pending)
            .addCase(newUnitIngredientList.rejected, newUnitIngredientListHandlers.rejected)
            .addCase(newUnitIngredientList.fulfilled, (state, action:PayloadAction<ResDataUnitUpdate, string>) => {
                state.operations.newUnitIngredientList.error = false
                state.operations.newUnitIngredientList.loading = false

                const {unit, _id} = action.payload;
                
                const thisIngr = state.list_ingr.find(el => el._id === _id)
                if(thisIngr){
                    thisIngr.units.push(unit)
                }
            })


            .addCase(updateCookUnit.pending, updateCookUnitHandlers.pending)
            .addCase(updateCookUnit.rejected, updateCookUnitHandlers.rejected)
            .addCase(updateCookUnit.fulfilled, (state, action: PayloadAction<updateCookUnitI, string>) => {
                state.operations.updateCookUnit.error = false
                state.operations.updateCookUnit.loading = false

                const { name, amount, _id } = action.payload;

                const ingredient = state.list_ingr.find(ingr => ingr.name === name);
                if (ingredient) {
                    const unit = ingredient.units.find(unit => unit._id === _id);
                    if (unit) {
                        unit.amount = amount;
                    }

                }
            })



            .addCase(toggleShopIngrFetch.pending, toggleShopIngrFetchHandlers.pending)
            .addCase(toggleShopIngrFetch.rejected, toggleShopIngrFetchHandlers.rejected)
            .addCase(toggleShopIngrFetch.fulfilled, (state, action: PayloadAction<ShopIngredientT, string>) => {
                state.operations.toggleShopIngrFetch.error = false
                state.operations.toggleShopIngrFetch.loading = false

                const ingredient = state.list_ingr.find(ingr => ingr._id === action.payload._id);
                if (ingredient) {
                    ingredient.shop_ingr = !action.payload.shop_ingr;
                }

            })


            .addCase(shopUnitUpdate.pending, shopUnitUpdateHandlers.pending)
            .addCase(shopUnitUpdate.rejected, shopUnitUpdateHandlers.rejected)
            .addCase(shopUnitUpdate.fulfilled, (state, action: PayloadAction<ShopUnitUpdateT, string>) => {
                state.operations.shopUnitUpdate.error = false
                state.operations.shopUnitUpdate.loading = false

                const { ingredient_id, unit_id, shop_unit } = action.payload;
                const ingredient = state.list_ingr.find(ingr => ingr._id === ingredient_id);
                if (ingredient) {
                    const unit = ingredient.units.find(unit => unit._id === unit_id);
                    if (unit) {
                        unit.shop_unit = !shop_unit;
                    }
                }
            })



            .addCase(deleteIngredientFetch.pending, deleteIngredientFetchHandlers.pending)
            .addCase(deleteIngredientFetch.rejected, deleteIngredientFetchHandlers.rejected)
            .addCase(deleteIngredientFetch.fulfilled, (state, action: PayloadAction<DeleteIngredientT, string>) => {
                state.operations.deleteIngredientFetch.error = false
                state.operations.deleteIngredientFetch.loading = false

                const { _id } = action.payload;
                state.list_ingr = state.list_ingr.filter(
                    (item) => item._id !== _id
                );
            })



            .addCase(deleteUnitIngrFetch.pending, deleteUnitIngrFetchHandlers.pending)
            .addCase(deleteUnitIngrFetch.rejected, deleteUnitIngrFetchHandlers.rejected)
            .addCase(deleteUnitIngrFetch.fulfilled, (state, action: PayloadAction<DeleteUnitIngredientT, string>) => {
                state.operations.deleteUnitIngrFetch.error = false
                state.operations.deleteUnitIngrFetch.loading = false

                const { ingredient_id, unit_id } = action.payload;
                const ingredient = state.list_ingr.find(ingr => ingr._id === ingredient_id);
                if (ingredient) {
                    ingredient.units = ingredient.units.filter(unit => unit._id !== unit_id);
                }
            })


            .addCase(changeAmountFetch.pending, changeAmountFetchHandlers.pending)
            .addCase(changeAmountFetch.rejected, changeAmountFetchHandlers.rejected)
            .addCase(changeAmountFetch.fulfilled, (state, action: PayloadAction<ChangeAmountT, string>) => {
                state.operations.changeAmountFetch.error = false
                state.operations.changeAmountFetch.loading = false
                
                const { ingredient_id, unit_id, amount } = action.payload;
        
                const ingredientIndex = state.list_ingr.findIndex(
                    (ingredient) => ingredient._id === ingredient_id
                );
                
                if (ingredientIndex !== -1) {
                    const unitIndex = state.list_ingr[ingredientIndex].units.findIndex(
                        (unit) => unit._id === unit_id
                    );
                    
                    if (unitIndex !== -1) {
                        state.list_ingr[ingredientIndex].units[unitIndex].amount = amount;
                    }
                }
            })



            .addCase(addNewUnit.pending, addNewUnitHandlers.pending)
            .addCase(addNewUnit.rejected, addNewUnitHandlers.rejected)
            .addCase(addNewUnit.fulfilled, (state, action: PayloadAction<ResAddNewUnitT, string>) => {
                state.operations.addNewUnit.error = false
                state.operations.addNewUnit.loading = false

                const { ingredient_id, new_unit } = action.payload;
                const ingredient = state.list_ingr.find(ingr => ingr._id === ingredient_id);
                if (ingredient) {
                    ingredient.units.push(new_unit)
                }
            })
        }
})
    

export const { closeAlertList } = listSlice.actions

    
export default listSlice.reducer