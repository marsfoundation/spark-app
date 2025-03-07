import { Panel } from '@/ui/atoms/panel/Panel'
import { ReactNode } from 'react'

interface WalletPanelContentProps {
  children: ReactNode
}

export function WalletPanelContent({ children }: WalletPanelContentProps) {
  return <Panel className="flex flex-col">{children}</Panel>
}
