import { Panel } from '@/ui/atoms/panel/Panel'

export function MyWalletChainMismatch() {
  return (
    <Panel.Wrapper>
      <div className="flex flex-col p-4 md:px-8 md:py-6">
        <div className="flex flex-col gap-4">
          <h3 className="font-semibold text-basemd:text-xl">My Wallet</h3>
          <p className="text-sm text-white/50">
            To access this asset, please switch your wallet connection to the appropriate chain.
          </p>
        </div>
      </div>
    </Panel.Wrapper>
  )
}
