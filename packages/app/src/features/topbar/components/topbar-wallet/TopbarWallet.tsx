import { Button } from '@/ui/atoms/button/Button'
import { TopbarWalletDropdown, TopbarWalletDropdownProps } from './TopbarWalletDropdown'

export interface TopbarWalletProps {
  connectedWalletInfo?: TopbarWalletDropdownProps
  onConnect: () => void
}

export function TopbarWallet({ connectedWalletInfo, onConnect }: TopbarWalletProps) {
  return (
    <div className="sm:w-36 md:w-44">
      {connectedWalletInfo ? (
        <TopbarWalletDropdown {...connectedWalletInfo} />
      ) : (
        <Button size="m" variant="primary" className="w-full px-3" onClick={onConnect}>
          <span>
            Connect <span className="hidden sm:inline">Wallet</span>
          </span>
        </Button>
      )}
    </div>
  )
}

TopbarWallet.displayName = 'TopbarWallet'
