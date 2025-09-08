// *S - start
// *E - end

import { RecipeMedia } from "../types";





//----------- state S-----------//

export interface CookRootState {
    connection_id:string
    recipes:Record<string, CookRecipe>;
    modified:Modified
    // recipes:CookRecipe[]
}

export interface Modified {
    name:string,
    time: {
        hours:string
        minutes:string 
    },
    recipe_type:string
    description: string
    instruction:string
}

export interface TempalateRecipeCook {
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

export interface CookRecipe extends TempalateRecipeCook{
    instruction:string,
    sorting:string[],
    ingredients:Ingredients[]
}

export interface Ingredients {
    units: Unit;
    ingredient_id: string;
    name: string;
    media: string;
}

export interface Unit {
    choice: string
    amount:number
    list: string[]
}

//---------- thunks S----------//

export interface CookFetchRes {
    recipe: CookRecipe
    connection_id: string
}

export interface CookFetchReq {
    id: string, 
    recipe_id: string
}

export interface DeleteCookFetch{
    connection_id: string, 
    recipe_id: string
}

export interface ChangeName {
    recipe_id:string
    name:string
}

//---------- thunks E----------//

//------- cook history S-------//

export interface CookHistoryRootState {
    connection_id:string,
    history_links:HistoryLinks[]
}

export interface HistoryLinks {
    recipe_id: string,
    recipe_name: string
}

//------- cook history E-------//

//---------- thunks S----------//

export interface HistoryLinksFetchReq {
    connection_id:string, 
    recipe_id:string
}

export interface NewCookHistoryFetch{
    connection_id:string,
    history_links:HistoryLinks
}

export interface DeleteCookHistoryFetch{
    connection_id:string, 
    recipe_id:string
}

//---------- thunks E----------//

//----------- state E-----------//





export interface ReturnData {
    choice: string,
    amount: number,
    _id: string
}
