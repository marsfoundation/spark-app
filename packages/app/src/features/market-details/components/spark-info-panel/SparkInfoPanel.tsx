import { assets } from '@/ui/assets'
import { Typography } from '@/ui/atoms/typography/Typography'
import { cn } from '@/ui/utils/style'

interface SparkInfoProps {
  title: JSX.Element
  content: JSX.Element
}

export function SparkInfoPanel({ title, content }: SparkInfoProps) {
  return (
    <div
      className={cn(
        'mt-6 py-4 rounded-lg',
        'col-start-1 col-end-[-1] flex items-center',
        'bg-spark/10 border-none',
      )}
    >
      <div className={cn('mx-3')}>
        <img src={assets.sparkIcon} alt="Spark logo" style={{ height: '2.75rem' }} />
      </div>
      <div className={cn("content-center")}>
        <Typography variant="h4" className={cn('col-span-1 content-end mt-1')}>
          {title}
        </Typography>
        <Typography className={cn('col-span-1 mt-1 content-start')}>
          <p className="text-xs text-prompt-foreground">{content}</p>
        </Typography>
      </div>
    </div>
  )
}
