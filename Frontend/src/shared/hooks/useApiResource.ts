import { useCallback, useEffect, useState } from "react";
import { apiErrorMessage } from "@/shared/api/client";

export function useApiResource<T>(loader: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setData(await loader());
    } catch (cause) {
      setError(apiErrorMessage(cause));
    } finally {
      setIsLoading(false);
    }
  }, [loader]);
  useEffect(() => {
    void Promise.resolve().then(refresh);
  }, [refresh]);
  return { data, isLoading, error, refresh };
}
