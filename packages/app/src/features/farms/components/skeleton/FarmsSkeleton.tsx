import { Skeleton } from '@/ui/atoms/skeleton/Skeleton'
import { PageLayout } from '@/ui/layouts/PageLayout'

export function FarmsSkeleton() {
  return (
    <PageLayout className="gap-8">
      <div className="flex flex-row items-center gap-5">
        <Skeleton className="h-16 w-56" />
      </div>

      <div>
        <Skeleton className="mb-4 h-7 w-56" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 sm:grid-cols-2 md:gap-8">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton className="h-80" key={index} />
          ))}
        </div>
      </div>
    </PageLayout>
  )
}
