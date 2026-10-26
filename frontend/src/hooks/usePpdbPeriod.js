import { useCallback, useEffect, useState } from 'react'
import api from '../services/api.js'

export function usePpdbPeriod() {
  const [period, setPeriod] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const requestPeriod = useCallback(() => {
    return api.get('/ppdb/settings')
      .then(({ data }) => setPeriod(data))
      .catch(err => {
        setError(err.message)
      })
      .finally(() => setLoading(false))
  }, [])

  const refetch = useCallback(() => {
    setLoading(true)
    setError('')
    return requestPeriod()
  }, [requestPeriod])

  useEffect(() => {
    requestPeriod()
  }, [requestPeriod])

  return { period, loading, error, refetch }
}
