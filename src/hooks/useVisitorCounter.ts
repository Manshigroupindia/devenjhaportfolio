import { useState, useEffect } from 'react';
import {
  recordVisitorSession,
  subscribeToVisitorCount,
  INITIAL_VISITOR_COUNT,
} from '../services/visitorCounterService.ts';

export interface UseVisitorCounterReturn {
  count: number;
  formattedCount: string;
  loading: boolean;
}

export function useVisitorCounter(): UseVisitorCounterReturn {
  const [count, setCount] = useState<number>(INITIAL_VISITOR_COUNT);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    // 1. Attempt session increment (deduplicated per browser session)
    recordVisitorSession().catch(() => {
      // Handled internally in service
    });

    // 2. Subscribe to real-time updates from Firestore
    const unsubscribe = subscribeToVisitorCount((latestCount) => {
      if (isMounted) {
        setCount(latestCount);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const formattedCount = count.toLocaleString('en-IN');

  return {
    count,
    formattedCount,
    loading,
  };
}

