import { Skeleton } from '@/ui/atoms/skeleton/Skeleton'
import { PageLayout } from '@/ui/layouts/PageLayout'

export function MarketDetailsSkeleton() {
  return (
    <PageLayout compact className="gap-8">
      <div className="flex flex-row items-center gap-8">
        <Skeleton className="h-8 w-36" />
        <Skeleton className="h-8 w-36" />
      </div>
      <Skeleton className="h-12 w-56" />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-[2fr_1fr] md:gap-10">
        <div className="flex flex-col gap-4 md:gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
        <div className="hidden flex-col gap-4 sm:flex md:gap-6">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-72 w-full" />
        </div>
      </div>
    </PageLayout>
  )
}
