import { createContext, useContext } from 'react';

export interface UnitRecipeIds {
    recipe_id?: string;
    ingredient_id: string;
    unit_id: string;
}

const UnitContext = createContext<UnitRecipeIds | null>(null);

export const useUnitContext = () => {
    const ctx = useContext(UnitContext);
    if (!ctx) throw new Error('useUnitContext must be used within UnitContext.Provider');
    return ctx;
};

export default UnitContext;
