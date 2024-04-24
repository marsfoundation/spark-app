import { Skeleton } from '@/ui/atoms/skeleton/Skeleton'

export function DialogContentSkeleton() {
  return (
    <div className="flex h-full flex-col gap-2">
      <Skeleton className="f-full h-8" />
      <Skeleton className="f-full h-80" />
      <Skeleton className="f-full h-32" />
    </div>
  )
}
