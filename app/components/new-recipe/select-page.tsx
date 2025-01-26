import { useAppDispatch, useAppSelector } from "@/state/hook"
import { TypeDish } from "./steps/type-dish";
import { NameAndTime } from "./steps/name-and-time";
import { Media } from "./steps/media";


export function SelectPage(){
    const stepperState = useAppSelector(state => state.setpForm);

    switch(stepperState.page_step){
        case 1:
            return <TypeDish></TypeDish>;
            // return <StepMedia></StepMedia>
            // return <StepIngredients></StepIngredients>
        case 2:
            return <NameAndTime></NameAndTime>
        case 3: 
            return <Media></Media>
        default:
            return null
    }
}