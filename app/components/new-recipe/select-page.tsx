import { useAppDispatch, useAppSelector } from "@/state/hook"
import { TypeDish } from "./steps/type-dish";


export function SelectPage(){
    const stepperState = useAppSelector(state => state.setpForm);

    switch(stepperState.page_step){
        case 1:
            return <TypeDish></TypeDish>;
            // return <StepMedia></StepMedia>
            // return <StepIngredients></StepIngredients>
            
        // case 2:
            // return <StepType/>;
        default:
            return null
    }
}