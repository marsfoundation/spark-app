import { assets } from '@/ui/assets'
import { Typography } from '@/ui/atoms/typography/Typography'

interface SparkInfoProps {
  title: JSX.Element
  content: JSX.Element
}

export function SparkInfoPanel({ title, content }: SparkInfoProps) {
  return (
    <div className="bg-spark/10 col-start-1 col-end-[-1] mt-6 flex items-center rounded-lg border-none py-4">
      <div className="mx-3">
        <img src={assets.sparkIcon} alt="Spark logo" className="h-[2.75rem]" />
      </div>
      <div className="content-center">
        <Typography variant="h4" className="col-span-1 mt-1 content-end">
          {title}
        </Typography>
        <Typography className="col-span-1 mt-1 content-start">
          <p className="text-prompt-foreground text-xs">{content}</p>
        </Typography>
      </div>
    </div>
  )
}
