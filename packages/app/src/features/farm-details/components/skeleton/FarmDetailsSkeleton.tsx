import { Skeleton } from '@/ui/atoms/skeleton/Skeleton'
import { PageLayout } from '@/ui/layouts/PageLayout'

export function FarmDetailsSkeleton() {
  return (
    <PageLayout className="gap-5">
      <div className="flex flex-row items-center gap-5">
        <Skeleton className="h-8 w-36" />
        <Skeleton className="h-8 w-36" />
      </div>
      <Skeleton className="h-16 w-56" />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Skeleton className="h-[398px] w-full" />
        <Skeleton className="h-[398px] w-full" />
      </div>
      <Skeleton className="h-64 w-full" />
    </PageLayout>
  )
}
