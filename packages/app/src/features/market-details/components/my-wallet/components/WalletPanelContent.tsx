import { ReactNode } from 'react'

interface WalletPanelContentProps {
  children: ReactNode
}

export function WalletPanelContent({ children }: WalletPanelContentProps) {
  return <div className="flex flex-col p-4 md:px-8 md:py-6">{children}</div>
}
