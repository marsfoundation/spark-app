import { Panel } from '@/ui/atoms/panel/Panel'

export function MyWalletChainMismatch() {
  return (
    <Panel className="flex flex-col gap-4">
      <h3 className="typography-heading-4 text-primary">My Wallet</h3>
      <p className="typography-label-5 text-secondary">
        To access this asset, please switch your wallet connection to the appropriate chain.
      </p>
    </Panel>
  )
}
