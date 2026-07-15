// useApiData.ts — tiny hook to standardize loading/error/data + refetch for list screens.
import { useCallback, useEffect, useState } from 'react'

interface State<T> {
  data: T | null
  loading: boolean
  error: string | null
  reload: () => void
}

export function useApiData<T>(
  fetcher: () => Promise<T>,
  deps: unknown[] = [],
): State<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setData(await fetcher())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data.')
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => {
    load()
  }, [load])

  return { data, loading, error, reload: load }
}
