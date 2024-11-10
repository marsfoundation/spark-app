import { Skeleton } from '@/ui/atoms/skeleton/Skeleton'
import { PageLayout } from '@/ui/layouts/PageLayout'

export function FarmsSkeleton() {
  return (
    <PageLayout>
      <Skeleton className="h-[60px] w-[270px]" />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 md:grid-cols-2 md:gap-8">
        {Array.from({ length: 2 }).map((_, index) => (
          <Skeleton className="h-80" key={index} />
        ))}
      </div>
    </PageLayout>
  )
}
