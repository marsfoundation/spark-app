import { Button } from '@/ui/atoms/button/Button'
import { Panel } from '@/ui/atoms/panel/Panel'

interface MyWalletDisconnectedProps {
  openConnectModal: () => void
}

export function MyWalletDisconnected({ openConnectModal }: MyWalletDisconnectedProps) {
  return (
    <Panel.Wrapper>
      <div className="flex flex-col p-4 md:px-8 md:py-6">
        <div className="flex flex-col gap-4">
          <h3 className="text-base font-semibold text-sky-950 md:text-xl">My Wallet</h3>
          <p className="text-sm text-slate-500">Please connect a wallet to view your personal information here.</p>
        </div>
        <Button className="mt-7" onClick={openConnectModal}>
          Connect wallet
        </Button>
      </div>
    </Panel.Wrapper>
  )
}
