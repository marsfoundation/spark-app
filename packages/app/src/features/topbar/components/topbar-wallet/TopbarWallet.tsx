import { Button } from '@/ui/atoms/new/button/Button'
import { TopbarWalletDropdown, TopbarWalletDropdownProps } from './TopbarWalletDropdown'

export interface TopbarWalletProps {
  connectedWalletInfo?: TopbarWalletDropdownProps
  onConnect: () => void
}

export function TopbarWallet({ connectedWalletInfo, onConnect }: TopbarWalletProps) {
  return (
    <div className="w-36 md:w-44">
      {connectedWalletInfo ? (
        <TopbarWalletDropdown {...connectedWalletInfo} />
      ) : (
        <Button size="m" variant="primary" className="w-full" onClick={onConnect}>
          Connect Wallet
        </Button>
      )}
    </div>
  )
}

TopbarWallet.displayName = 'TopbarWallet'
