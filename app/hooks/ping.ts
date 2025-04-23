import { useEffect, useRef } from 'react';

export default function useUserAFKPing(idleTime: number = 9000) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      fetch('/api/ping'); 
    }, idleTime);
  };

  useEffect(() => {
    const handleActivity = () => resetTimer();
    const handleVisibilityChange = () => {
      if (!document.hidden) resetTimer();
    };

    document.addEventListener('mousemove', handleActivity);
    document.addEventListener('keydown', handleActivity);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    resetTimer(); 

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      document.removeEventListener('mousemove', handleActivity);
      document.removeEventListener('keydown', handleActivity);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [idleTime]);
}