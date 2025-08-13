// *S - start
// *E - end

import { ListIngrData, NormalizedData, UnitNoId, UnitsId } from "../list/types"




//----------- state S-----------//

export interface NormalizedRecipeData extends NormalizedData{
    recipes: {
        [key: string]: ListRecipeData;
    };
}


export interface ListRecipeRootState{
    connection_id:string
    page:number | null
    // recipes:ListRecipeData[]
    recipes: NormalizedRecipeData['recipes'];
    ingredients: NormalizedRecipeData['ingredients']; 
    units: NormalizedRecipeData['units'];
}

export interface ListRecipeData {
    _id:string
    recipe_id: string
    recipe_name: string
    recipe_media:{
        url:string
        type:string
    },
    recipe_shop:boolean
    ingredient_ids: string[]
    // ingredients_list: ListIngrData[]
}

export interface TemplateIngrListRecipe{
    ingredient_id:string, 
    connection_id:string, 
    _id:string
}

//---------- thunks S----------//

export interface PreLoaderFetchRes {
    connection_id:string,
    page:number | null
    recipe:ListRecipeData[]
}

export interface PreLoaderFetchReq {
    connection_id:string, 
    page:number
}

export interface NewListRecipeFetchReq {
    connection_id: string, 
    recipe_id: string
}

export interface IngrListRecipeFetchRes {
    connection_id:string,
    _id:string,
    ingredients:ListIngrDataFetch[]
}

export interface ListIngrDataFetch {
    _id:string,
    name: string,
    media:string,
    shop_ingr: boolean,
    list: string[],
    units: UnitsIdFetch[]
}

export interface UnitsIdFetch {
    choice: string,
    amount: number,
    shop_unit:boolean,
    _id:string
}

export interface IngrListRecipeFetchReq { 
    connection_id: string, 
    _id: string 
}

export interface ShopIngrListRecipeFetch extends TemplateIngrListRecipe {
    shop_ingr: boolean
}

export interface DeleteIngrListRecipeFetch extends TemplateIngrListRecipe{
}

export interface ShopUnitListRecipeFetch extends TemplateIngrListRecipe{
    unit_id:string,
    shop_unit:boolean
}

export interface DeleteUnitListRecipeFetch extends TemplateIngrListRecipe{
    unit_id:string
}

export interface ChangeAmountListRecipeFetch extends TemplateIngrListRecipe{
    unit_id: string, 
    amount: number
}

export interface NewUnitListRecipeFetchRes extends TemplateIngrListRecipe{
    new_unit:UnitsIdFetch
}

export interface NewUnitListRecipeFetchReq extends TemplateIngrListRecipe{
    updated_unit:UnitNoId
}

export interface DeleteListRecipeFetchReq {
    connection_id:string, 
    recipe_id:string
}

//---------- thunks E----------//

//----------- state E-----------//