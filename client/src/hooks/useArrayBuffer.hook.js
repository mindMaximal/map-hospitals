import {useCallback, useState} from 'react'

export const useArrayBuffer = (callback, deps) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const request = useCallback(async (url, method = 'GET', body = null, headers = {}) => {

    setLoading(true)

    try {

      if (body) {
        body = JSON.stringify(body)
        headers['Content-Type'] = 'application/json'
      }

      const response = await fetch(url, {method, body, headers})

      const data = await response.arrayBuffer().then((buffer) => {
          let binary = '';
          const bytes = new Uint8Array( buffer );
          const len = bytes.byteLength;
          for (let i = 0; i < len; i++) {
            binary += String.fromCharCode( bytes[ i ] );
          }

          return 'data:application/octet-stream;base64,' + binary
      })

      if (!response.ok) {
        throw new Error('useArrayBuffer: ' + data.message || 'Что-то пошло не так')
      }

      setLoading(false)

      return data

    } catch (e) {
      setLoading(false)
      setError('useArrayBuffer catch: ' + e.message)
      throw e
    }
  }, [])

  const clearError = useCallback(() => setError(null), [])

  return {loading, request, error, clearError}
}