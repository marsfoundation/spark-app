import { WalletDropdownContentInfo, WalletDropdownTriggerInfo } from '@/features/navbar/types'
import { Button } from '@/ui/atoms/new/button/Button'
import { TopbarWalletDropdown } from './TopbarWalletDropdown'

export interface TopbarWalletProps {
  connectedWalletInfo?: {
    dropdownTriggerInfo: WalletDropdownTriggerInfo
    dropdownContentInfo: WalletDropdownContentInfo
  }
  onConnect: () => void
}

export function TopbarWallet({ connectedWalletInfo, onConnect }: TopbarWalletProps) {
  return (
    <div className="w-44">
      {connectedWalletInfo ? (
        <TopbarWalletDropdown {...connectedWalletInfo} />
      ) : (
        <Button variant="primary" className="w-full" onClick={onConnect}>
          Connect Wallet
        </Button>
      )}
    </div>
  )
}

TopbarWallet.displayName = 'TopbarWallet'
