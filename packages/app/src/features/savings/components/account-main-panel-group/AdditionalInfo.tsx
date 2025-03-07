import { Info } from '@/ui/molecules/info/Info'
import { ReactNode } from 'react'

function Label({ children, tooltipContent }: { children: React.ReactNode; tooltipContent?: ReactNode }) {
  return (
    <div className="typography-label-3 flex items-center gap-1 text-tertiary">
      <div>{children}</div>
      {tooltipContent && <Info className="icon-tertiary">{tooltipContent}</Info>}
    </div>
  )
}

function Content({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}

const AdditionalInfo = {
  Label,
  Content,
}
export { AdditionalInfo }
