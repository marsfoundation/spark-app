import { Loader2 } from 'lucide-react'

export function FallbackLayout() {
  if (import.meta.env.MODE === 'development') {
    throw new Error('Missing Suspense fallback! Did you forget about skeletons?')
  }

  return (
    <div className="flex h-screen">
      <Loader2 className="m-auto h-40 w-40 animate-spin" />
    </div>
  )
}
