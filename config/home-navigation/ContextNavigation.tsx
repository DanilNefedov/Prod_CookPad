'use client'

import { NavigationContextProps } from "@/app/(main)/home/types";
import { createContext, ReactNode, useContext, useState } from "react";



export interface Props{
  children:ReactNode
}



const StepsContext = createContext<NavigationContextProps>({
  handlerNavigation: () => { },
  nav: 'all'
});

export function NavigationProvider({ children }: Props) {
  const [nav, setNav] = useState<string>('all')

  function handlerNavigation(navigation: string | null) {
    if(navigation !== null) setNav(navigation)
    
  }

  return <StepsContext.Provider value={{ handlerNavigation,nav}}> { children } </StepsContext.Provider>
  
}
export function useNavigationState() {
  return useContext(StepsContext)
}



