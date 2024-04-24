import { Fragment } from 'react'

import { Panel } from '@/ui/atoms/panel/Panel'
import { Skeleton } from '@/ui/atoms/skeleton/Skeleton'

export function ActionsSkeleton() {
  const rows = 3
  return (
    <Panel.Wrapper className="mt-6">
      <div className="flex flex-col p-4 md:px-8 md:py-6">
        <Skeleton className="mb-1 h-6 w-1/12" />
        {Array.from({ length: rows }).map((_, index) => (
          <Fragment key={index}>
            <Skeleton className="my-4 h-8 w-full" />
            {index !== rows - 1 && <div className="border-b" />}
          </Fragment>
        ))}
        <Skeleton className="mt-1 h-6 w-1/4 self-end" />
      </div>
    </Panel.Wrapper>
  )
}
