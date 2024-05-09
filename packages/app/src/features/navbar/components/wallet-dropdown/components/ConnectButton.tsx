import { WalletButton } from './WalletButton'

interface ConnectButtonProps {
  onConnect: () => void
}

export function ConnectButton({ onConnect }: ConnectButtonProps) {
  return (
    <WalletButton variant="primary" className="bg-primary-bg justify-center" onClick={onConnect}>
      Connect wallet
    </WalletButton>
  )
}
