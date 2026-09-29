import { useEffect, useState } from 'react';
import { posDB } from '../db/indexedDB';

/**
 * useDatabaseInit — Initializes client-side IndexedDB cache.
 * Product fetching is handled directly via live API in ProductCatalog.
 */
export function useDatabaseInit() {
  const [isDbReady, setIsDbReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    async function initDB() {
      try {
        await posDB.getDB();
        if (mounted) {
          setIsDbReady(true);
        }
      } catch (err) {
        console.error('Failed to initialize POS IndexedDB:', err);
        if (mounted) {
          setError(err as Error);
        }
      }
    }

    initDB();

    return () => {
      mounted = false;
    };
  }, []);

  return { isDbReady, error };
}
