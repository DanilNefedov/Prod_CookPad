import { useAppSelector } from "@/state/hook";
import { useMemo } from "react";



export function useShowMinOneFilledWarning(numbStep: number):boolean{
    const stepperState = useAppSelector((state) => state.ingredientsSlice);
    const openPage = useAppSelector((state) => state.statusStepSlice.steps[numbStep]?.open);

    const showWarning = useMemo(() => {
        if (!openPage) return false;
    
        const ingredients = stepperState.ingredients;
    
        const hasAtLeastOneFilled = ingredients.some((ingredient) => {
            if (!('amount' in ingredient.units)) return false;
        
            const hasName = ingredient.name.trim() !== '';
            const hasAmount = ingredient.units.amount > 0;
            const hasChoice = ingredient.units.choice.trim() !== '';
        
            return hasName && hasAmount && hasChoice;
        });
    
        return !hasAtLeastOneFilled;
    }, [openPage, stepperState.ingredients]);
    
    return showWarning;
}