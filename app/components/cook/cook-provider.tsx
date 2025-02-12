'use client'

import { createContext, useContext, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/state/hook'
import { fetchHistoryCook } from '@/state/slices/cook-history'
import { fetchCook } from '@/state/slices/cook'

interface CookContextType {
  recipe_id: string
}

const CookContext = createContext<CookContextType | null>(null)

export function CookProvider({ 
  children, 
  recipe_id 
}: { 
  children: React.ReactNode
  recipe_id: string 
}) {
  const dispatch = useAppDispatch()
  const userStore = useAppSelector(state => state.user)
  const cookStore = useAppSelector(state => state.cook)
  const cookHistoryStore = useAppSelector(state => state.cookHistory)

  useEffect(() => {
    const id = userStore.user.connection_id
    const findCook = cookStore.recipes.find(el => el.recipe_id === recipe_id)
    
    if (id !== '') {
      if (cookHistoryStore.history_links.length <= 0) {
        dispatch(fetchHistoryCook({ connection_id: id }));
      }
      
      if (!findCook) {
        dispatch(fetchCook({ id, recipe_id }));
      }
    }
  }, [recipe_id, userStore.user.connection_id, cookHistoryStore.history_links.length, cookStore.recipes, dispatch]);
  return (
    <CookContext.Provider value={{ recipe_id }}>
      {children}
    </CookContext.Provider>
  )
}

// Хук для использования контекста
export const useCook = () => {
  const context = useContext(CookContext)
  if (!context) {
    throw new Error('useCook must be used within CookProvider')
  }
  return context
}