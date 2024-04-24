import { Skeleton } from '@/ui/atoms/skeleton/Skeleton'
import { PageLayout } from '@/ui/layouts/PageLayout'

export function DashboardSkeleton() {
  return (
    <PageLayout className="max-w-6xl">
      <div className="flex h-full flex-col gap-6">
        <div className="flex flex-row gap-6">
          <Skeleton className="h-56 w-1/3" />
          <Skeleton className="h-56 grow" />
        </div>
        <Skeleton className="h-56 w-full" />
        <Skeleton className="h-56 w-full" />
      </div>
    </PageLayout>
  )
}
