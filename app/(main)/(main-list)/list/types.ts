// *S - start
// *E - end





//----------- state S-----------//

export interface ListRootState {
    page_list: number | null,
    connection_id: string,
    list_ingr: ListIngrData[]
}

export interface ListIngrData {
    _id:string,
    name: string,
    media:string,
    shop_ingr: boolean,
    list: string[],
    units: UnitsId[]
}

export interface UnitsId {
    choice: string,
    amount: number,
    shop_unit:boolean,
    _id:string
}

export interface UnitNoId{
    choice:string
    amount:number
    shop_unit:boolean
}

//---------- thunks S----------//

export interface ListFetchRes {
    page_list:number | null
    connection_id: string,
    list_ingr: ListIngrData[]
}

export interface ListFetchReq {
    id:string, 
    page_list:number
}

export interface NewIngrFetch {
    _id:string,
    name:string,
    media:string,
    shop_ingr:boolean
    units:UnitsId[]
    list:string[]
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

//---------- thunks E----------//

//----------- state E-----------//