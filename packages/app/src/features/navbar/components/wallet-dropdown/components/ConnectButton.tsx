import { WalletButton } from './WalletButton'

interface ConnectButtonProps {
  onConnect: () => void
}

export function ConnectButton({ onConnect }: ConnectButtonProps) {
  return (
    <WalletButton variant="primary" className='justify-center bg-primary-bg' onClick={onConnect}>
      Connect wallet
    </WalletButton>
  )
}
