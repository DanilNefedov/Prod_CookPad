import { createSlice, PayloadAction } from "@reduxjs/toolkit";




type CommentsContextStateT ={
    status: false,
    error: false,
    comment:{
        id_comment:string,
        author_name: string,
        id_branch: string
    }
   
}


const initialState: CommentsContextStateT = {
    status: false,
    error: false,
    comment: {
        id_comment:'',
        author_name: '',
        id_branch: ''
    },
    
};





const commentContext = createSlice({
    name: 'commentContext',
    initialState,
    reducers: {
        setActiveComment: (state, action:PayloadAction<{id_comment:string, author_name:string, id_branch:string}, string>) =>{
            state.comment.id_comment = action.payload.id_comment
            state.comment.author_name = action.payload.author_name
            state.comment.id_branch = action.payload.id_branch

           
        },
        
    },


})


export const { setActiveComment } = commentContext.actions;


export default commentContext.reducer