'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export function ToastBanner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const ok = searchParams.get('ok')
  const error = searchParams.get('error')

  useEffect(() => {
    if (!ok && !error) return

    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      params.delete('ok')
      params.delete('error')
      const query = params.toString()
      router.replace(query ? `?${query}` : '?', { scroll: false })
    }, 3500)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ok, error])

  if (!ok && !error) return null

  return (
    <div
      className={`mb-5 rounded-md border px-4 py-3 text-sm ${
        error
          ? 'border-red-300 bg-red-50 text-red-800'
          : 'border-caramel bg-caramel/10 text-brown'
      }`}
    >
      {error ?? ok}
    </div>
  )
}
