interface ChildrenProps {
  children: React.ReactNode
}

export function TooltipContentLayout({ children }: ChildrenProps) {
  return <div className="flex flex-col gap-3">{children}</div>
}

function Header({ children }: ChildrenProps) {
  return <div className="flex items-center">{children}</div>
}

function Icon({ src }: { src: string }) {
  return <img src={src} className="mr-2 h-5 w-5" />
}

function Title({ children }: ChildrenProps) {
  return <h4 className="flex flex-row font-semibold">{children}</h4>
}

function Body({ children }: ChildrenProps) {
  return <p className="max-w-[32ch] text-prompt-foreground">{children}</p>
}

TooltipContentLayout.Header = Header
TooltipContentLayout.Icon = Icon
TooltipContentLayout.Title = Title
TooltipContentLayout.Body = Body
