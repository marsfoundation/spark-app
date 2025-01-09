import { Skeleton } from '@/ui/atoms/skeleton/Skeleton'
import { PageLayout } from '@/ui/layouts/PageLayout'

export function SavingsSkeleton() {
  return (
    <PageLayout>
      <Skeleton className="h-[60px] w-[190px]" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Skeleton className="h-[188px] w-full md:h-[448px] lg:h-[398px]" />
        <Skeleton className="h-[188px] w-full md:h-[448px] lg:h-[398px]" />
      </div>
      <Skeleton className="h-[388px] w-full" />
    </PageLayout>
  )
}
