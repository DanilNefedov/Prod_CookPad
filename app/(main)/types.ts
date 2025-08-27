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
    // popular_config: PopularConfig[]
}

// export interface PopularConfig {
//     category_id: string
//     name:string
//     multiplier: number[]
// }

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
    time: {
        hours:string
        minutes:string 
    }
    media:RecipeMedia[]
    recipe_type:string
    description: string
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
    // connection_id:string, 
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


