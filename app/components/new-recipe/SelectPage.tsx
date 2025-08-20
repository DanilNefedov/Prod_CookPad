import { TypeDish } from "./steps/TypeDish";
import { NameAndTime } from "./steps/NameAndTime";
import { RecipeMedia } from "./steps/RecipeMedia";
import { IngredientConstruction } from "./steps/ingredient/IngredientConstruction";
import { RecipeDescription } from "./steps/RecipeDescription";
import { RecipeInstruction } from "./steps/RecipeInstruction";



export function SelectPage({step}:{step:number}){

    switch(step){
        case 1:
            return <TypeDish></TypeDish>
        case 2:
            return <NameAndTime></NameAndTime>
        case 3: 
            return <RecipeMedia></RecipeMedia>
        case 4:
            return <IngredientConstruction></IngredientConstruction>
        case 5:
            return <RecipeDescription></RecipeDescription>
        case 6:
            return <RecipeInstruction></RecipeInstruction>
        default:
            return null
    }
}