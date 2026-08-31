import { useCallback, useEffect, useRef, useState } from "react";
import { apiErrorMessage } from "@/shared/api/client";

export function useApiResource<T>(loader: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0);
  const refresh = useCallback(async () => {
    const currentRequest = ++requestId.current;
    setIsLoading(true);
    setError(null);
    try {
      const result = await loader();
      if (currentRequest === requestId.current) setData(result);
    } catch (cause) {
      if (currentRequest === requestId.current)
        setError(apiErrorMessage(cause));
    } finally {
      if (currentRequest === requestId.current) setIsLoading(false);
    }
  }, [loader]);
  useEffect(() => {
    setData(null);
    void Promise.resolve().then(refresh);
    return () => {
      requestId.current += 1;
    };
  }, [refresh]);
  return { data, isLoading, error, refresh };
}
