'use client'
// import { initUserStateType, collectionUser } from "@/types/types"
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"

export type popConfig = {
    category_id: string
    name:string
    multiplier: number[]
}

export type collectionUser =  {
    name: string ,
    email: string ,
    provider: string ,
    img: string ,
    connection_id: string ,
    popular_config: popConfig[] 
}

export type initUserStateType = {
    status: boolean,
    error: boolean,
    user:collectionUser
}



export type UserOperationKey =
  | 'fetchUser'
  | 'fetchClearUser'
  


type OperationStatus = {
    loading: boolean
    error: boolean
}

type OperationState = Record<UserOperationKey, OperationStatus>

interface UserState extends initUserStateType {
    operations: OperationState
}

const defaultStatus: OperationStatus = { loading: true, error: false }



const initialState: UserState = {
    status: false,
    error: false,
    user: {
        name: '',
        email: '',
        provider: '',
        img: '',
        connection_id: '',
        popular_config: [
           
        ]
    },
    operations:{
        fetchUser:defaultStatus,
        fetchClearUser:defaultStatus
    }

}


export const fetchUser = createAsyncThunk<collectionUser, string, { rejectValue: string }>(
    'userSlice/fetchUser',
    async function (connection_id, { rejectWithValue }) {
        try {
            const response = await fetch(`/api/user?connection_id=${connection_id}`);

            if (!response.ok) {
                return rejectWithValue('Server Error!');
            }

            const data = await response.json();
            console.log(data)
            return data.user;

        } catch (error) {
            console.error(error)
            return rejectWithValue('Request failed!');
        }
    }
);


// move it to a regular reduser
export const fetchClearUser = createAsyncThunk<[], {rejectValue: string}>(
    'userSlice/fetchClearUser',
    async function (_, {rejectWithValue}){
        try{
            const data: [] = []

            return data
        }catch(error){
            console.error(error)
            return rejectWithValue('Request failed!');
        }
    }
)





const createReducerHandlers = <T extends keyof UserState['operations']>(operationName: T) => ({
    pending: (state: UserState) => {
        state.operations[operationName].error = false;
        state.operations[operationName].loading = true;
    },
    rejected: (state: UserState) => {
        state.operations[operationName].error = true;
        state.operations[operationName].loading = false;
    }
});


const fetchUserHandlers = createReducerHandlers('fetchUser');
const fetchClearUserHandlers = createReducerHandlers('fetchClearUser');


const userSlice = createSlice({
    name: 'userSlice',
    initialState,
    reducers: {
        closeAlertUser(state, action: PayloadAction<UserOperationKey>){
            const key = action.payload

            if (state.operations[key]) {
                state.operations[key].error = false
                state.operations[key].loading = false
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUser.pending, fetchUserHandlers.pending)
            .addCase(fetchUser.rejected, fetchUserHandlers.rejected)
            .addCase(fetchUser.fulfilled, (state, action: PayloadAction<collectionUser, string>) => {
                state.operations.fetchUser.error = false
                state.operations.fetchUser.loading = false

                if (action.payload) {
                    
                    const payload = action.payload;

                    state.user.name = payload.name;
                    state.user.email = payload.email;
                    state.user.provider = payload.provider;
                    state.user.img = payload.img;
                    state.user.connection_id = payload.connection_id;

                    payload.popular_config.forEach(el => {
                        state.user.popular_config.push(el)
                    })
                  
                }
            })
            .addCase(fetchClearUser.pending, fetchClearUserHandlers.pending)
            .addCase(fetchClearUser.rejected, fetchClearUserHandlers.rejected)
            .addCase(fetchClearUser.fulfilled, (state) => {
                state.operations.fetchClearUser.error = false
                state.operations.fetchClearUser.loading = false
            })


    }
})

export const { closeAlertUser } = userSlice.actions;



export default userSlice.reducer