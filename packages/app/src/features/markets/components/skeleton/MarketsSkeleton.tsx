import { Skeleton } from '@/ui/atoms/skeleton/Skeleton'
import { PageLayout } from '@/ui/layouts/PageLayout'

export function MarketsSkeleton() {
  return (
    <PageLayout className="gap-8">
      <Skeleton className="h-[60px] w-56" />
      <div className="grid grid-cols-2 gap-x-8 gap-y-4 md:grid-cols-4 md:gap-x-16 xl:gap-x-32">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton className="h-[66px]" key={index} />
        ))}
      </div>
      <div className="flex flex-col gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton className="h-[86px] w-full" key={index} />
        ))}
      </div>
    </PageLayout>
  )
}
