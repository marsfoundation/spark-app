import { Skeleton } from '@/ui/atoms/skeleton/Skeleton'
import { PageLayout } from '@/ui/layouts/PageLayout'
import { times } from 'remeda'

export function MarketsSkeleton() {
  return (
    <PageLayout className="gap-5 md:gap-8">
      <Skeleton className="h-[40px] w-56 md:h-[60px]" />
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-5">
        {times(4, (index) => (
          <Skeleton className="h-[84px] md:h-[128px]" key={index} />
        ))}
      </div>
      <div className="flex flex-col gap-4">
        {times(4, (index) => (
          <Skeleton className="h-[86px] w-full" key={index} />
        ))}
      </div>
    </PageLayout>
  )
}
