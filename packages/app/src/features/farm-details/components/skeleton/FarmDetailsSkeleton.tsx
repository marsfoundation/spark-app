import { Skeleton } from '@/ui/atoms/skeleton/Skeleton'
import { PageLayout } from '@/ui/layouts/PageLayout'

export function FarmDetailsSkeleton() {
  return (
    <PageLayout className="gap-8">
      <div className="flex flex-row items-center gap-8">
        <Skeleton className="h-6 w-36" />
        <Skeleton className="h-6 w-36" />
      </div>
      <Skeleton className="h-12 w-56" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Skeleton className="h-[384px] w-full" />
        <Skeleton className="h-[384px] w-full" />
      </div>
      <Skeleton className="h-64 w-full" />
    </PageLayout>
  )
}
