import { Panel } from '@/ui/atoms/panel/Panel'
import { Skeleton } from '@/ui/atoms/skeleton/Skeleton'
import { PageLayout } from '@/ui/layouts/PageLayout'
import { useBreakpoint } from '@/ui/utils/useBreakpoint'

export function EasyBorrowSkeleton() {
  const tablet = useBreakpoint('md')
  const desktop = useBreakpoint('xl')
  return (
    <PageLayout compact>
      <div className="flex flex-col items-center md:mt-12">
        <Skeleton className="h-12 w-52 md:w-80" />
        <Skeleton className="mt-6 h-6 w-64 md:w-96" />
      </div>
      <div className="mt-7 flex justify-center md:mt-10">
        <Panel.Wrapper className="flex min-w-full max-w-3xl flex-col p-4 md:p-8">
          <Skeleton className="h-10 w-1/6" />
          <Skeleton className="mt-8 h-8 w-3/12" />
          <Skeleton className="mt-4 h-14 w-full" />
          {!tablet && (
            <>
              <Skeleton className="mt-4 h-8 w-1/12" />
              <Skeleton className="mt-6 h-14 w-full" />
            </>
          )}
          <Skeleton className="mt-6 h-9 w-3/12" />
          <Skeleton className="mt-8 h-12 w-full" />
          {!desktop && (
            <>
              <Skeleton className="mt-11 h-8 w-1/6" />
              <Skeleton className="mt-3 h-8 w-1/2" />
              <div className="mt-4 flex justify-between">
                <Skeleton className="h-8 w-1/6" />
                <Skeleton className="h-8 w-1/6" />
              </div>
            </>
          )}
          <Skeleton className="mt-8 h-10 w-full" />
        </Panel.Wrapper>
      </div>
    </PageLayout>
  )
}
