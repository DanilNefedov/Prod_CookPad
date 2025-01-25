import { useAppDispatch } from '@/state/hook';
import { useEffect, useMemo } from 'react';
const _ = require('lodash');

type UseFetchProps<TData, TDep, TActionName> = {
  url: string; 
  data: TData; 
  dep: TDep[]; 
  actionName: (args: TActionName) => any; 
}


export const useFetchOnDependency = <TData, TDep, TActionName>({
  url,
  data,
  dep,
  actionName,
}: UseFetchProps<TData, TDep, TActionName>): void => {
  const dispatch = useAppDispatch();



  const deps = useMemo(() => dep.map(item => 
    typeof item === 'object' && item !== null ? JSON.stringify(item) : item
  ), [dep]);

  useEffect(() => {
    if (!url || dep.some((d) => !d)) return;

    if(data !== null) {
      dispatch(actionName({url, data} as TActionName));
    }else {
      dispatch(actionName(url as TActionName));
    }
    
  },deps);
};
