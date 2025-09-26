// *S - start
// *E - end



//----------- state S-----------//

//----------- user S------------//
export interface UserRootState {
    user: UserData
}

export interface UserData {
    name: string
    email: string
    provider: string
    img: string
    connection_id: string
}

//----------- user E------------//

//---------- recipe S-----------//

export interface RecipeRootState {
    page:number | null,
    recipes:RecipeData[]
}

export interface RecipeData extends TempalateRecipe {
    sorting:string[]
}

export interface TempalateRecipe {
    recipe_id:string 
    name:string
    media:RecipeMedia[]
    recipe_type:string
    favorite:boolean
}

export interface RecipeMedia {
    main:boolean,
    media_url:File | null | string,
    media_id:string,
    media_type:string
}



//---------- thunks S----------//

export interface FavoriteRecipeFetch {
    recipe_id:string, 
    favorite:boolean
}

//---------- thunks E----------//

//---------- recipe E-----------//

//----------- state E-----------//



export interface DataPage {
    name: string
    path: string[]
    icon:React.ReactNode
}


