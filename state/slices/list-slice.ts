import { IListState, IngredientFullData, IRequestList, NewUnitIngredient, NewUnitObj } from "@/app/types/types";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";



const initialState: IListState = {
    status: false,
    error: false,
    connection_id: '',
    list_ingr: [

        // ingredient_id: string,
        // name: string,
        // media:string,
        // shop_ingr: boolean,
        // list:[string],
        // count,------
        // units: [{
        //    shop_unit:boolean,
        //    choice: string,
        //    amount: number,
        //    _id:string
        // }]
    ]
}


interface newUnitCookPage {
    connection_id:string,
    name:string,
    media:string,
    shop_ingr:boolean
    units:NewUnitObj[]
    list:string[]
}
interface reqDataNewUnit{
    dataUnit:newUnitCookPage
    method:string
}




interface updateUnitCookpage {
    connection_id: string,
    name: string,
    units: NewUnitObj,
}
interface reqDataUpdateUnit{
    dataUnit:updateUnitCookpage
    method:string
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

            // console.log(dataList.data)

            return dataList.data
            

        } catch (error) {
            console.log(error)
            throw error
        }
    }
)


// export const newUnitCookPage = createAsyncThunk<returnNewUnit | returnNewIngredient, newUnitCookPageI, { rejectValue: string }>(
export const newUnitCookPage = createAsyncThunk<reqDataNewUnit | reqDataUpdateUnit, reqDataNewUnit | reqDataUpdateUnit, { rejectValue: string }>(
    'list/newUnitCookPage',
    async function (reqData, { rejectWithValue }) {
        try {
            console.log(reqData.dataUnit, reqData.method)
            const response = await fetch('/api/list/cook-ingredient', {
                method: reqData.method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reqData.dataUnit)
            });

            if (!response.ok) {
                throw new Error('Server Error!');
            }

            const { data } = await response.json()
            console.log(data)
            return reqData;

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

            // const dataList = await response.json()
            // console.log(dataList)
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

                        // const { ingredient_id, media, name, units, shop_ingr, list } = el
                        // const processedUnits = units.map(unit => ({
                        //     amount: unit.amount,
                        //     choice: unit.choice,
                        //     shop_unit: unit.shop_unit,
                        //     _id: unit._id
                        // }));
                        // // console.log(el)
                        // state.list_ingr.unshift({ ingredient_id, media, name, list, units: processedUnits, shop_ingr })
                    }
                })

            })


// export interface IListObj{
//     _id:string,
//     name: string,
//     media:string,
//     shop_ingr: boolean,
//     list: string[],
//     units: UnitsList[]
// }

            .addCase(newUnitCookPage.pending, (state) => {
                state.status = true,
                state.error = false
            })
            .addCase(newUnitCookPage.fulfilled, (state, action:PayloadAction<reqDataNewUnit | reqDataUpdateUnit, string>) => {
                const {dataUnit, method} = action.payload;
                // console.log(action.payload)
                // const ingredient = state.list_ingr.find(ingr => ingr.name === data.name);
                // if(messages === 'new_unit' && ingredient && !('list' in data)){
                //     ingredient.units.push({
                //         shop_unit: data.shop_unit,
                //         choice: data.choice,
                //         amount: data.amount,
                //         _id:data._id
                //     })
                // }

                if(method === 'POST'){
                    state.list_ingr.push(dataUnit)
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