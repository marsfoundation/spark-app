import { Skeleton } from '@/ui/atoms/skeleton/Skeleton'
import { PageLayout } from '@/ui/layouts/PageLayout'
import { cn } from '@/ui/utils/style'

export interface SavingsSkeletonProps {
  numberOfAccounts: number
}

export function SavingsSkeleton({ numberOfAccounts }: SavingsSkeletonProps) {
  return (
    <PageLayout>
      <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
        <Skeleton className="h-[60px] w-[190px]" />
        <Skeleton className="h-[45px] w-full lg:w-[340px]" />
      </div>
      <div className={cn('grid grid-cols-1 gap-6', numberOfAccounts > 1 && 'lg:grid-cols-[202px_1fr]')}>
        {numberOfAccounts > 1 && (
          <div className="flex flex-row gap-2 lg:flex-col">
            {Array.from({ length: numberOfAccounts }, (_, k) => (
              <NavigationItemSkeleton key={k} />
            ))}
          </div>
        )}
        <div className="flex flex-col gap-6">
          <Skeleton className="h-[352px] w-full" />
          <Skeleton className="h-[352px] w-full" />
        </div>
      </div>
    </PageLayout>
  )
}

function NavigationItemSkeleton() {
  return <Skeleton className="size-28 h-[60px] lg:h-16 lg:w-auto" />
}
