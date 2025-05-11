'use client'

import { createContext, ReactNode, useContext, useState } from "react";


export interface INavigationContext {
    handlerNavigation: (navigation: string | null) => void 
    nav: string
}


export interface IProps{
    children:ReactNode
}



const StepsContext = createContext<INavigationContext>({
  handlerNavigation: () => { },
  nav: 'all'
});

export function NavigationProvider({ children }: IProps) {
  const [nav, setNav] = useState<string>('all')

  function handlerNavigation(navigation: string | null) {
    if(navigation !== null) setNav(navigation)
    
  }

  return <StepsContext.Provider value={{ handlerNavigation,nav}}> { children } </StepsContext.Provider>
  
}
export function useNavigationState() {
  return useContext(StepsContext)
}



