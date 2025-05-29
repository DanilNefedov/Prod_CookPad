// import { Ingredients } from '@/types/types';
import { ReactNode } from "react";

export interface RequestData <T>{
    url: string;
    data: T;
}




export type recipes = {
    idRecipe:string | null, 
    nameRecipe:string | null, 
    imgRecipe:string | null, 
    title:string | null, 
    mark:number | null,
    time:number | null,
}

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





// export interface IFormData {
//     type: string
//     name: string
//     media: null | File | string
//     description: string
//     instruction:string
// }

// export interface IFormContext{
//     onHandlePrev: () => void 
//     onHandleNext: () => void 
//     step: number,
//     updateFormData: (data: Partial<IFormData>) => void
//     formData:IFormData
//     // ingredients:IIngredients[]
//     handleAddIngredients: (name:string) => void
//     deleteIngredients: (name:string, ingredient_id: string) => void
//     handleChangeIngredients:(name: string, ingredient_id: string, value: string) => void,
//     saveFrom: () => void
//     // savePhoto:() => void
//     hours:string
//     minutes:string
//     handleHourIncrement:() => void,
//     handleHourDecrement:() => void,
//     handleMinuteIncrement:() => void,
//     handleMinuteDecrement:() =>void,
//     handleHourChange:(e: ChangeEvent<HTMLInputElement>) => void,
//     handleMinuteChange:(e: ChangeEvent<HTMLInputElement>) => void,
//     // state:ITypeIng[],
//     errorState:ErrorState, 
//     // setErrorState: () => void
   
// }

export interface IProps{
    children:ReactNode
}

// export interface ErrorState {
//     nameError: string,
//     status:boolean,
//     steps:number[]
// }


// export interface Ingredient {
//     ingredient_id: string;
//     name: string;
//     media: string;
//     units: string[];
// }

// export interface IngredientForState {
//     ingredient_id: string;
//     name: string;
//     media: string;
//     units: (string[] | unitsState);
// }

// export interface unitsState {
//     choice: null | string
//     amount:number
//     list: string[]
// }
// export interface ITypeIngForState {
//     ingr_type: string,
//     id:string,
//     class:string,
//     ingr:IngredientForState[]
// }

// export interface IngredientAutocomp {
//     _id: string;
//     ingr_type: string;
//     name: string;
//     units: string[];
//     media: string;
// }
 

// export interface ITypeIng{
//     ingr_type: string,
//     id:string,
//     class:string,
//     ingr:Ingredient[]
// }

// export interface IIngredients{
//     ingredient_id:string | null | undefined, 
//     name:string | null | undefined  ||||||||||||||||||||||||||||||||||||||
// }

// export interface IRecipe{
//     recipe_id:string | null , 
//     name:string | null , 
//     time: {
//         hours:null | string ,
//         minutes:null | string 
//     }, 
//     media:MediaObj[], 
//     recipe_type:string | null , 
//     instruction:string | null ,
//     sorting:string[],
//     description: string | null 
//     ingredients:IngredientForAutocomplite[],
//     favorite:boolean
// }

// export interface ISaveFormThunk  {
//     url: string,
//     recipeData:IRecipe
// }

// export interface IFetchDataRecipe{
//     url: string,
//     recipeData:IRecipe
// }


// export interface MediaObj {
//     main:boolean,
//     media_url:File | null | string,
//     media_id:string,
//     media_type:string
// }



// ---------------------------------- TEMPLATE TYPE --------------------------------//

export interface ErrorStatus {
    status: boolean,
    error: boolean,
}

// export interface ISaveFormThunk  {
//     url: string,
//     recipeData:IRecipe
// }

export interface unitsState {
    choice: string
    amount:number
    list: string[]
}

export interface MediaObj {
    main:boolean,
    media_url:File | null | string,
    media_id:string,
    media_type:string
}

export interface IngredientTemplateT{
    ingredient_id: string;
    name: string;
    media: string;
}

export interface IngredientStateTemplate{
    ingredient_id: string;
    name: string;
    media: string;
}



export interface IngredientForAutocomplite extends IngredientStateTemplate{
    // check_open_link?:string, 
    new_ingredient?:boolean,
    units: (string[] | unitsState);
}

export interface IngredientFullData extends IngredientStateTemplate{
    units: unitsState;
}



export type TempalateRecipe = {
    recipe_id:string  , 
    name:string , 
    time: {
        hours:string ,
        minutes:string 
    }, 
    media:MediaObj[], 
    recipe_type:string , 
    // instruction:string | null ,
    // sorting:string[],
    description: string, 
    // ingredients:IngredientForState[],
    favorite:boolean
}

// ---------------------------------- TEMPLATE TYPE --------------------------------//

// export interface IRecipeSliceInit extends IRecipeSlice{
//     status: boolean,
//     error: boolean,
// }



// ---------------------------------- COOK PAGE --------------------------------//
export type CookPageT = TempalateRecipe & {
    instruction:string,
    sorting:string[],
    ingredients:IngredientFullData[]
}
export type CookPageSaveT = TempalateRecipe & {
    instruction:string,
    sorting:string[],
    ingredients:IngredientForAutocomplite[],//for save form
}

export type FetchCookPage = {
    connection_id:string ,
    recipes:CookPageT[]
}

export type CookSliceT = FetchCookPage & ErrorStatus & {
    name_status:string,
    // activeRequests: Set<string>,
    // name_links:INameLinks[]
}
// export interface ICookSliceInit extends MainRecipePage{
//     name_status:string,
//     name_links:INameLinks[]
// }


export type CookHistoryT = ErrorStatus & {
    connection_id:string,
    history_links:NameLinksT[]
}

export interface NameLinksT {
    recipe_id: string,
    recipe_name: string
}

// ---------------------------------- COOK PAGE --------------------------------//



// ---------------------------------- RECIPES PAGE --------------------------------//

export type MainRecipeT = TempalateRecipe & {
    sorting:string[],
}

export type MainRecipePage = {
    connection_id:string | null,
    recipes:MainRecipeT[]
}


export type INameLinks = {
    name:string | null,
    recipe_id:string | null
}

export type IRecipeSlice = ErrorStatus & {
    // connection_id:string | null,
    page:number | null,
    recipes:MainRecipeT[]
}


export type IFetchDataRecipe = CookPageSaveT & {
    connection_id: string,
    // recipeData:CookPageT
}
// export interface ICookSliceInit extends MainRecipePage{
//     name_status:string,
//     name_links:INameLinks[]
// }

// ---------------------------------- RECIPES PAGE --------------------------------//





// export interface IRecipeSliceInit {
    
//     recipes_info:IRecipeSlice
// }



export interface INavigationContext {
    handlerNavigation: (navigation: string | null) => void 
    nav: string
}



export interface ingredintFetch {
    _id: string;
    ingr_type: string;
    name: string;
    units: string[];
    media: string;
}



// export interface IIngredientsRequest{
//     ingr_type:string,
//     ingr_list:[
//         {
//             name:string,
//             units:string[],
//             media:string
//         }
//     ]
// }




/*
ingredients:[
    {
        ingr_type: 'vegetables', 
        ingr_list:[
            {name: 'name', units:['test1', 'test2', 'test3']},
            {name: 'name', units:['test1', 'test2', 'test3']}
        ]
    }
]

*/





// export interface StateStepByStep{
//     errorName: string,
//     status:boolean,
//     stepError:number[],
//     step:number,
//     type_recipe: string,
//     name_recipe: string,
//     minutes:string,
//     hours:string,
//     media:string,
//     ingredients:ITypeIng[],
//     description: string,
//     instruction:string
// }
export interface UnitsList {
    choice: string,
    amount: number,
    shop_unit:boolean,
    _id:string
}

export interface IListObj{
    // ingredient_id: string,
    _id:string,
    name: string,
    media:string,
    shop_ingr: boolean,
    list: string[],
    units: UnitsList[]
}

export interface IListState{
    status: boolean,
    error: boolean,
    page_list: number | null,
    connection_id: string,
    list_ingr: IListObj[]
}

export interface IRequestList {
    connection_id: string,
    list_ingr: IListObj[]
}



// -------------------------------------  LIST RECIPE TYPE ----------------------------//

export type MainListRecipe = ErrorStatus & {
    connection_id:string,
    page:number | null
    recipes:TempalteRecipeForList[]
    
}

export type returnDataRecipeList = {
    connection_id:string,
    recipes:TempalteRecipeForList[]
}



export type TempalteRecipeForList = {
    _id:string
    recipe_id: string,
    recipe_name: string,
    // recipe_media:MediaObj[],
    recipe_media:{
        url:string,
        type:string
    },
    recipe_shop:boolean,
    ingredients_list: IListObj[],
}

// export type RecipeListWithIngr = TempalteRecipeForList & {
//     ingredients_list: IListObj[],
// }


export interface IngredientNewList extends IngredientStateTemplate{
    units: unitsState;
}


export interface NewUnitObj{
    choice:string
    amount:number
    shop_unit:boolean
}
export interface NewUnitIngredient {
    name:string,
    media:string,
    shop_ingr:boolean
    units:NewUnitObj[]
    list:string[]
}
export interface ResUnitObj extends NewUnitObj{
    _id:string
}



// -------------------------------------  LIST RECIPE TYPE ----------------------------//





// -------------------------------------  POPULAR ----------------------------//


export type popularInitData = ErrorStatus & {
    pop_list:PopularListDataT[]
}

export type recipeDataP = {
    description:string,
    name:string,
    id_recipe: string,
    type:string,
    recipe_media:MediaObj[],
}

export type popularList = {
    // _id:string,
    // id_author:string,
    // recipe_data:recipeDataP,
    fully:number,
    // liked:boolean,
    likes:number,
    views:number,
    saves:number,
    comments:number,
    categories:string[],
    // creator: mongoose.Schema.Types.ObjectId;
}

export type PopularAuthorInfoT = {
    id_author:string,
    author_name:string,
    author_img:string,
}

export type PopularListDataT = {
    config_id:string,
    id_recipe:string,
    author_info:PopularAuthorInfoT
    description:string,
    recipe_name:string,
    recipe_media:MediaObj[],
    liked:boolean,
    likes:number,
    views:number,
    saves:number,
    saved:boolean,
    comments:number,
}

// export type CommentState = ErrorStatus & {
//     comments: {
//         page:number,
//         list:CommListData[]
//     }; 
//     replies: {
//         page:number,
//         list:ReplyCommData[]
//     }; 
// };
// export type commListState = ErrorStatus & {
//     comm_list:CommListData[]
//     page:number
// }





export type CommListData = {
    id_comment: string,
    id_author: string,
    author_avatar:string,
    author_name:string,
    config_id: string,
    text: string,
    reply_count:number,
    likes_count:number
    // page_reply?:number,
    // reply_list?:ReplyCommData[],
    createdAt?:string,
    liked?:boolean
}

export type ReplyCommData = {
    id_comment: string,
    id_author:string,
    id_branch:string, //id_comment from commListData
    id_parent: string,// for first reply - commListData next id_comment form replyCommData
    name_parent:string,
    author_avatar:string,
    author_name:string,
    text: string,
    likes_count:number,
    createdAt?:string,
    liked?:boolean
}

// -------------------------------------  POPULAR ----------------------------//