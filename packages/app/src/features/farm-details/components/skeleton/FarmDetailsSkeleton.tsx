import { Skeleton } from '@/ui/atoms/skeleton/Skeleton'
import { PageLayout } from '@/ui/layouts/PageLayout'

export function FarmDetailsSkeleton() {
  return (
    <PageLayout>
      <div className="flex flex-row items-center gap-5">
        <Skeleton className="h-8 w-36" />
        <Skeleton className="h-8 w-40" />
      </div>
      <Skeleton className="h-[60px] w-60" />
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Skeleton className="h-[380px] w-full md:h-[456px] lg:h-[414px]" />
        <Skeleton className="h-[380px] w-full md:h-[456px] lg:h-[414px]" />
      </div>
      <Skeleton className="h-[469px] w-full" />
    </PageLayout>
  )
}
