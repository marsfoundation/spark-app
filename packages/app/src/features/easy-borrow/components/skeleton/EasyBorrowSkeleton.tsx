import { Skeleton } from '@/ui/atoms/skeleton/Skeleton'
import { PageLayout } from '@/ui/layouts/PageLayout'

export function EasyBorrowSkeleton() {
  return (
    <PageLayout className="gap-8">
      <Skeleton className="h-[60px] w-56" />
      <div className="hidden h-full grid-cols-[67%_calc(33%-18px)] gap-[18px] xl:grid">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-[180px]" />
          <Skeleton className="h-[224px]" />
        </div>
        <div className="flex flex-col gap-6">
          <Skeleton className="h-[188px]" />
        </div>
      </div>
      <div className="mt-8 flex flex-col gap-6 xl:hidden">
        <div className="grid grid-cols-1 gap-6">
          <Skeleton className="h-[407px] sm:h-[180px]" />
          <Skeleton className="h-[460px] sm:h-[224px]" />
        </div>
        <Skeleton className="h-[276px]" />
      </div>
    </PageLayout>
  )
}
