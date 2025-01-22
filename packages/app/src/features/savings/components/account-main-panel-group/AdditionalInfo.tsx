import { Info } from '@/ui/molecules/info/Info'

function Label({ children, tooltipText }: { children: React.ReactNode; tooltipText?: string }) {
  return (
    <div className="typography-label-3 flex items-center gap-1 text-tertiary">
      <div>{children}</div>
      {tooltipText && <Info className="icon-tertiary">{tooltipText}</Info>}
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
