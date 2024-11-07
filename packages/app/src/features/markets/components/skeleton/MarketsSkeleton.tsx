import { Skeleton } from '@/ui/atoms/skeleton/Skeleton'
import { PageLayout } from '@/ui/layouts/PageLayout'

export function MarketsSkeleton() {
  return (
    <PageLayout className="gap-8">
      <div className="flex flex-row items-center gap-4">
        <Skeleton className="h-12 w-56" />
      </div>
      <div className="grid grid-cols-2 gap-y-4 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton className="h-12 max-w-[144px]" key={index} />
        ))}
      </div>
      <div className="flex flex-col gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton className="h-12 w-full" key={index} />
        ))}
      </div>
    </PageLayout>
  )
}
