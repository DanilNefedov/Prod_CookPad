import { IListState, IngredientFullData, IRequestList, NewUnitIngredient, NewUnitObj } from "@/app/types/types";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";



const initialState: IListState = {
    status: false,
    error: false,
    connection_id: '',
    list_ingr: [
    ]
}


interface NewIngredientListT {
    connection_id:string,
    name:string,
    media:string,
    shop_ingr:boolean
    units:NewUnitObj[]
    list:string[]
}
interface ResUnitObj extends NewUnitObj{
    _id:string
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

export const fetchList = createAsyncThunk<IRequestList, string, { rejectValue: string }>(
    'list/fetchList',
    async function (id, { rejectWithValue }) {
        try {
            const urlList = `/api/list?connection_id=${id}`
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
                throw new Error('Server Error!');
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
                throw new Error('Server Error!');
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
                throw new Error('Server Error!');
            }

            return data;

        } catch (error) {
            console.log(error);
            throw error;
        }
    }
);



const listSlice = createSlice({
    name: 'list',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchList.pending, (state) => {
                state.status = true,
                state.error = false
            })
            .addCase(fetchList.fulfilled, (state, action: PayloadAction<IRequestList, string>) => {
                state.error = false,
                state.status = false
                const payload = action.payload
                state.connection_id = payload.connection_id

                payload.list_ingr.map(el => {
                    const findThisIngr = state.list_ingr.find(elem => (elem._id === el._id))

                    if (!findThisIngr) {
                        state.list_ingr.push(el)
                    }
                })

            })


           .addCase(newIngredientList.pending, (state) => {
                state.status = true,
                state.error = false
            })
            .addCase(newIngredientList.fulfilled, (state, action:PayloadAction<ResNewIngredientListT, string>) => {
                const data = action.payload;

                const thisIngr = state.list_ingr.find(el => el._id === data._id)
                if(state.list_ingr.length > 0 && !thisIngr){
                    state.list_ingr.push(data)
                    

                }
            })

            .addCase(newUnitIngredientList.pending, (state) => {
                state.status = true,
                state.error = false
            })
            .addCase(newUnitIngredientList.fulfilled, (state, action:PayloadAction<ResDataUnitUpdate, string>) => {
                const {unit, _id} = action.payload;
                const thisIngr = state.list_ingr.find(el => el._id === _id)

                if(thisIngr){
                    thisIngr.units.push(unit)
                }
            })

            .addCase(updateCookUnit.pending, (state) => {
                state.status = true,
                state.error = false
            })
            .addCase(updateCookUnit.fulfilled, (state, action: PayloadAction<updateCookUnitI, string>) => {
                const { name, amount, _id } = action.payload;
                const ingredient = state.list_ingr.find(ingr => ingr.name === name);
                if (ingredient) {
                    const unit = ingredient.units.find(unit => unit._id === _id);
                    if (unit) {
                        unit.amount = amount;
                    }

                }
            })


        }
})
    
    
export default listSlice.reducer