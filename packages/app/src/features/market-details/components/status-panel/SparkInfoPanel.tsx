import { assets } from '@/ui/assets'
import { Panel } from '@/ui/atoms/panel/Panel'
import { cn } from '@/ui/utils/style'

interface SparkInfoProps {
  title: JSX.Element
  content: JSX.Element
}

export function SparkInfoPanel({ title, content }: SparkInfoProps) {
  return (
    <Panel.Wrapper
      className={cn(
        'mt-6 py-4',
        'col-start-1 col-end-[-1] grid grid-cols-[auto_1fr] grid-rows-[auto_auto]',
        'bg-spark/10 border-none',
      )}
    >
      <Panel.Title variant="h4" className={cn('col-span-1 content-end')}>
        {title}
      </Panel.Title>
      <Panel.Content className={cn('row-span-2 row-start-1 m-4 content-center')}>
        <img src={assets.sparkIcon} alt="Spark logo" style={{ height: '2.5rem' }} />
      </Panel.Content>
      <Panel.Content className={cn('col-span-1 mt-2 content-start')}>
        <p className="text-xs text-slate-500">{content}</p>
      </Panel.Content>
    </Panel.Wrapper>
  )
}
