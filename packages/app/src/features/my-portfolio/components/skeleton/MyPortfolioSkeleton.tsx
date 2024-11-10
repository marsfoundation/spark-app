import { Skeleton } from '@/ui/atoms/skeleton/Skeleton'
import { PageLayout } from '@/ui/layouts/PageLayout'

export function MyPortfolioSkeleton() {
  return (
    <PageLayout>
      <div className="hidden h-full grid-cols-[67%_calc(33%-18px)] gap-[18px] xl:grid">
        <div className="flex flex-col gap-6">
          <Skeleton className="h-[312px]" />
          <Skeleton className="h-[899px]" />
        </div>
        <div className="flex flex-col gap-6">
          <Skeleton className="h-[400px]" />
          <Skeleton className="h-[420px]" />
        </div>
      </div>
      <div className="flex flex-col gap-6 xl:hidden">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Skeleton className="h-[407px] sm:h-[420px]" />
          <Skeleton className="h-[460px] sm:h-[420px]" />
        </div>
        <Skeleton className="h-[276px]" />
        <Skeleton className="h-[400px]" />
      </div>
    </PageLayout>
  )
}
