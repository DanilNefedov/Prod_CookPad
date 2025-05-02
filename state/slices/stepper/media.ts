import { MediaObj } from "@/app/types/types"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { resetAllState } from "./reset-action"





export interface MediaT {
    media:MediaObj[]
}
    


const initialState: MediaT = {
    media: [],
}




const mediaSlice = createSlice({
    name: 'mediaSlice',
    initialState,
    reducers: {
        changeMedia(state, action: PayloadAction<{media:MediaObj[]}>) {
            action.payload.media.map(el => {
                state.media.push(el)
            })
            // state.media.push(...action.payload.media)            
        },

        deleteMediaState(state, action: PayloadAction<string>){
            state.media = state.media.filter(item => item.media_id !== action.payload);
        },

        setMainMedia(state, action: PayloadAction<string>){
            const clickedElement = state.media.find(el => el.media_id === action.payload);

            if (clickedElement) {
                if (clickedElement.main) {
                    state.media.forEach(el => {
                        el.main = false;
                    });
                } else {
                    state.media.forEach(el => {
                        el.main = el.media_id === action.payload;
                    });
                }
            }
            
        },
       
    },
    extraReducers: (builder) => {
        builder.addCase(resetAllState, () => initialState);
    },

})




export const { changeMedia, deleteMediaState, setMainMedia } = mediaSlice.actions


export default mediaSlice.reducer