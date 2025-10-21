// *S - start
// *E - end

import { IngredientAutocomplite } from "../../new-recipe/types";





//----------- state S-----------//
export interface NormalizedData {
    ingredients: {
        [key: string]: ListIngrData;
    };
    units: {
        [key: string]: UnitsId;
    };
}

// export interface ListRootState {
//     page_list: number | null,
//     connection_id: string,
//     list_ingr: ListIngrData[]
// }

export interface ListRootState {
    page_list: number | null,
    connection_id: string,
    ingredients: NormalizedData['ingredients'];
    queue_ingredients:string[],
    units: NormalizedData['units'];
    // list_ingr: ListIngrData[]
}


// export interface ListIngrDataFetch {
//     _id:string,
//     name: string,
//     media:string,
//     shop_ingr: boolean,
//     list: string[],
//     units: UnitsId[]
// }
export interface ListIngrData {
    ingredient_id: string;
    name: string;
    media: string;
    shop_ingr: boolean;
    list: string[];
    unit_ids: string[];
}

// export interface UnitsId {
//     choice: string,
//     amount: number,
//     shop_unit:boolean,
//     _id:string
// }
export interface UnitsId {
    unit_id: string;
    choice: string;
    amount: number;
    shop_unit: boolean;
}

export interface UnitNoId{
    choice:string
    amount:number
    shop_unit:boolean
}

export interface UnitRecipeIds {
    recipe_id?: string;
    ingredient_id: string;
    unit_id: string;
}

export interface ListContext {
    unit_info:UnitRecipeIds
    input_value:{
        value: string | null;
        open_input:string
    }
}

//---------- thunks S----------//

export interface UnitsIdFetch {
    choice: string,
    amount: number,
    shop_unit:boolean,
    _id:string
}

export interface ListIngrDataFetch {
    _id:string,
    name: string,
    media:string,
    shop_ingr: boolean,
    list: string[],
    units: UnitsIdFetch[]
}

export interface ListFetchRes {
    page_list:number | null
    connection_id: string,
    list_ingr: ListIngrDataFetch[]
}

export interface ListFetchReq {
    id:string, 
    page_list:number
}

export interface CreateIngredientsFetchReq {
    connection_id:string,
    data:IngredientAutocomplite[]
}

export interface NewIngrFetchRes {
    _id:string,
    name:string,
    media:string,
    shop_ingr:boolean
    units:UnitsId[]
    list:string[]
}

export interface NewIngrFetchReq {
    connection_id: string,
    name: string
    media: string
    shop_ingr: boolean
    units: UnitNoId[]
    list: string[]
}

export interface NewUnitIngrFetchRes {
    unit:UnitsId
    _id:string
}

export interface NewUnitIngrFetchReq {
    connection_id: string,
    name: string,
    units: UnitNoId,
}

export interface UpdCookUnitFetch {
    name:string,
    connection_id: string,
    _id: string,
    amount: number,
}

export interface ShopIngrFetch {
    _id:string, 
    shop_ingr:boolean
}

export interface ShopUnitFetch {
    ingredient_id: string
    unit_id:string
    shop_unit:boolean
}

export interface DeleteUnitIngrFetch {
    ingredient_id:string, 
    unit_id:string 
}

export interface ChangeAmountFetch {
    ingredient_id:string,
    unit_id:string,
    amount:number
}

export interface NewUnitFetchRes {
    ingredient_id:string,
    new_unit:UnitsId
}

export interface NewUnitFetchReq {
    ingredient_id:string,
    new_unit:UnitNoId
}

export interface UnitCreateIngr extends UnitNoId {
    unit_id:string
}

export interface CreatedIngredientResult {
    type: "created";
    ingredient_id: string;
    name: string;
    media: string;
    shop_ingr: boolean;
    list: string[];           
    units: UnitCreateIngr;             
}

export interface UpdatedIngredientResult {
    type: "updated";
    ingredient_id: string;
    new_unit: UnitCreateIngr;           
}

export type CreateIngredientsFetchRes = CreatedIngredientResult | UpdatedIngredientResult;



//---------- thunks E----------//

//----------- state E-----------//