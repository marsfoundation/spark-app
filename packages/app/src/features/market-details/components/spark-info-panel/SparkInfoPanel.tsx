import { assets } from '@/ui/assets'
import { Typography } from '@/ui/atoms/typography/Typography'

interface SparkInfoProps {
  title: JSX.Element
  content: JSX.Element
}

export function SparkInfoPanel({ title, content }: SparkInfoProps) {
  return (
    <div className='flex flex-row items-center gap-3.5 rounded-lg bg-spark/10 p-[15px]'>
      <img src={assets.sparkIcon} alt="Spark logo" className="h-[2.75rem]" />
      <div className="flex flex-col gap-1">
        <Typography variant="h4">{title}</Typography>
        <p className="text-prompt-foreground text-xs">{content}</p>
      </div>
    </div>
  )
}
