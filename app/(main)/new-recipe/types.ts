// *S - start
// *E - end

import { TempalateRecipe } from "@/app/types/types";
import { Unit } from "../cook/types";



//----------- state S-----------//

//-------- ingredient S---------//

export interface IngredientAutocomplite {
    ingredient_id: string;
    name: string;
    media: string;
    new_ingredient?:boolean,
    units: (string[] | Unit);
}

export interface Amount  {
    ingredient_id: string,
    amount: number
}

export interface Autocompite  {
    ingredient_id: string,
    name: string,
    media: string,
    new_ingredient:boolean,
    units: string[]
}

export interface ChoiceUnits {
    ingredient_id: string,
    choice: string
}

//-------- ingredient E---------//

//----------- state E-----------//







export interface DataType {
    id: string,
    idRecipe: string,
    media_id: string,
    media_url: string,
}


export type SaveFormResult = {
    error?: unknown;
    message?: string | null;
} | null;

export interface NewDataRecipe extends TempalateRecipe{
    connection_id: string,
    instruction:string,
    sorting:string[],
    ingredients:IngredientAutocomplite[],
}

export interface CallbackIngrAutocomplite{
    _id: string;
    ingr_type: string;
    name: string;
    units: string[];
    media: string;
}