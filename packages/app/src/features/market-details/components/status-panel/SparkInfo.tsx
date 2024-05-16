import { Panel } from '@/ui/atoms/panel/Panel';
import { assets } from '@/ui/assets';
import { cn } from '@/ui/utils/style';

interface SparkInfoProps {
  title: JSX.Element
  content: JSX.Element
}

export function SparkInfo({title, content}: SparkInfoProps) {
  return (
    <Panel.Wrapper className={cn(
      'mt-6 py-4',
      'col-start-1 col-end-[-1] grid grid-cols-[auto_1fr] grid-rows-[auto_auto]',
      'bg-spark/10 border-none'
    )}>
      <Panel.Title variant="h4" className={cn('col-span-1 content-end')}>
        {title}
      </Panel.Title>
      <Panel.Content className={cn('row-start-1 row-span-2 content-center m-4')}>
        <img src={assets.sparkIcon} alt="Spark logo" style={{ height: '2.5rem' }} />
      </Panel.Content>
      <Panel.Content className={cn('col-span-1 content-start mt-2')}>
        <p className='text-xs text-slate-500'>
          {content}
        </p>
      </Panel.Content>
    </Panel.Wrapper>
  );
}
