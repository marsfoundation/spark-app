import { cn } from '@/ui/utils/style'
import { useIsTruncated } from '@/ui/utils/useIsTruncated'

export function HorizontalScroll({ children, className }: { children: React.ReactNode; className?: string }) {
  const [titleRef, isTruncated] = useIsTruncated()

  return (
    <div
      className={cn(
        'flex overflow-x-auto overflow-y-hidden text-nowrap',
        isTruncated &&
          '-ml-2 pr-3 pl-2 [mask-image:linear-gradient(to_right,transparent,black_7%,black_85%,transparent)] sm:[mask-image:none]',
        className,
      )}
      ref={titleRef}
    >
      {children}
    </div>
  )
}
