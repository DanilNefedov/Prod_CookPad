import { CookPageT, CookSliceT } from "@/app/types/types";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { newCookHistory } from "./cook-history";
import { favoriteDataRecipeT } from "./recipe-slice";
import { RootState } from "../store";
import { merge } from 'lodash';


// export interface returnDataFavorite {
//     recipe_id: string | null;
//     favorite: boolean;
// }

// export interface favoriteDataRecipe {
//     url:string, 
//     recipeData: {
//         recipe_id: string | null, 
//         favorite: boolean
//     }
// }


const initialState: CookSliceT = {
    status: false,
    error: false,
    name_status: '',
    connection_id: '',
    // name_links:[],
    recipes: [

        // {
        //     recipe_id:null, 
        //     name:null, 
        //     time:{hours:null, minutes:null}, 
        //     media:null, 
        //     recipe_type:null, 
        //     instruction:null, 
        //     sorting:['','',''], 
        //     description:'',
        //     favorite:false,
        //     ingredients:[
        //         {
        //             ingredient_id:null, 
        //             value:null
        //         }
        //     ]
        // }
    ]
}


interface fetchDataT {
    recipe: CookPageT
    connection_id: string
}


export const fetchCook = createAsyncThunk<fetchDataT, { id: string, recipe_id: string}, { rejectValue: string }>(
    'cook/fetchCook',
    async function ({ id, recipe_id }, { rejectWithValue, dispatch, getState }) {
        try {
            const state = getState() as RootState
            const recipeExists = state.recipe.recipes.find(el => el.recipe_id === recipe_id)

            const responseCook = await fetch(`/api/cook?connection_id=${id}&recipe=${recipe_id}&recipeExists=${recipeExists ? true : false}`);

            if (!responseCook.ok) return rejectWithValue('Server Error!');

            const dataCook = await responseCook.json()
            dispatch(newCookHistory({ connection_id: id, history_links: { recipe_id, recipe_name: dataCook.name } }))

            if(recipeExists){
                const mergedRecipe = merge({}, recipeExists, dataCook);
            
                return { recipe: mergedRecipe, connection_id: id }
            }else{
                return { recipe: dataCook, connection_id: id }
            }
            
        

        } catch (error) {
            console.error(error)
            throw error
        }
    }
)

type DataDelete = {
    connection_id: string, 
    recipe_id: string
}

export const deleteRecipe = createAsyncThunk<DataDelete, DataDelete, { rejectValue: string }>(
    'cook/deleteRecipe',
    async function (data, { rejectWithValue }) {
        try {
            const url = `/api/cook?connection_id=${data.connection_id}/${data.recipe_id}`
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                return rejectWithValue('Server Error!');
            }
            // const cookData = await response.json();
            // console.log(cookData)

            return data

        } catch (error) {
            console.error(error)
            throw error
        }
    }
)



const cookSlice = createSlice({
    name: 'cook',
    initialState,
    reducers: {
        updateStatus(state, action: PayloadAction<string, string>) {
            state.name_status = action.payload
        },

        setFavoriteCook(state, action: PayloadAction<favoriteDataRecipeT, string>) {
            const payload = action.payload;

            const findRecipe = state.recipes.find(el => el.recipe_id === payload.recipe_id)

            if (findRecipe) {
                findRecipe.favorite = !payload.favorite
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCook.pending, (state) => {
                state.status = true,
                    state.error = false
            })
            .addCase(fetchCook.fulfilled, (state, action: PayloadAction<fetchDataT, string>) => {
                if (action.payload) {
                    state.status = false;
                    state.error = false;
                    const payload = action.payload;

                    state.connection_id = payload.connection_id

                    state.recipes.push(payload.recipe)
                }
            })
            .addCase(fetchCook.rejected, (state) => {
                state.status = false;
                state.error = true;
            })

            .addCase(deleteRecipe.pending, (state) => {
                state.status = true,
                    state.error = false
            })
            .addCase(deleteRecipe.fulfilled, (state, action: PayloadAction<DataDelete, string>) => {
                // state.name_links = state.name_links.filter(link => link.recipe_id !== action.payload.recipe_id);
                state.recipes = state.recipes.filter(link => link.recipe_id !== action.payload.recipe_id)
            })

            .addCase(deleteRecipe.rejected, (state, action) => {
                state.status = false;
                state.error = true;
            })

    }
})

export const {
    setFavoriteCook
} = cookSlice.actions





export default cookSlice.reducer