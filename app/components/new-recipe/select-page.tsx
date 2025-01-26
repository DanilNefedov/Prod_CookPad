import { useAppDispatch, useAppSelector } from "@/state/hook"
import { TypeDish } from "./steps/type-dish";
import { NameAndTime } from "./steps/name-and-time";
import { Media } from "./steps/media";
import { Ingredients } from "./steps/ingredients";


export function SelectPage(){
    const stepperState = useAppSelector(state => state.setpForm);

    switch(stepperState.page_step){
        case 1:
            return <TypeDish></TypeDish>
        case 2:
            return <NameAndTime></NameAndTime>
        case 3: 
            return <Media></Media>
        case 4:
            return <Ingredients></Ingredients>
        default:
            return null
    }
}