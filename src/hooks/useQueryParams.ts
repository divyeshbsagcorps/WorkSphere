import { useSearchParams } from 'react-router-dom';
import { useMemo, useCallback } from 'react';

export const useQueryParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const queryParams = useMemo(() => {
    const params: Record<string, string> = {};
    searchParams.forEach((val, key) => {
      params[key] = val;
    });
    return params;
  }, [searchParams]);

  const setQueryParam = useCallback(
    (key: string, value: string | undefined | null) => {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        if (value === undefined || value === null || value === '' || value === 'All') {
          newParams.delete(key);
        } else {
          newParams.set(key, value);
        }
        return newParams;
      });
    },
    [setSearchParams]
  );

  const setMultipleQueryParams = useCallback(
    (updates: Record<string, string | undefined | null>) => {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        Object.entries(updates).forEach(([key, value]) => {
          if (value === undefined || value === null || value === '' || value === 'All') {
            newParams.delete(key);
          } else {
            newParams.set(key, value);
          }
        });
        return newParams;
      });
    },
    [setSearchParams]
  );

  return {
    queryParams,
    setQueryParam,
    setMultipleQueryParams,
  };
};
