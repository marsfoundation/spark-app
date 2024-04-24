import { Skeleton } from '@/ui/atoms/skeleton/Skeleton'

import { PageLayout } from '../PageLayout'

export function SavingsSkeleton() {
  return (
    <PageLayout>
      <Skeleton className="h-12 w-56" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
      <Skeleton className="h-64 w-full" />
    </PageLayout>
  )
}
