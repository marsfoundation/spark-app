import { Skeleton } from '@/ui/atoms/skeleton/Skeleton'
import { PageLayout } from '@/ui/layouts/PageLayout'

export function SavingsSkeleton() {
  return (
    <PageLayout>
      <Skeleton className="h-10 w-56" />
      <div className="grid h-[398px] grid-cols-1 gap-6 sm:grid-cols-2">
        <Skeleton className="w-full" />
        <Skeleton className="w-full" />
      </div>
      <Skeleton className="h-[280px] w-full" />
    </PageLayout>
  )
}
