import { Panel } from '@/ui/atoms/panel/Panel'

export function MyWalletChainMismatch() {
  return (
    <Panel className="flex flex-col gap-4">
      <h3 className="font-semibold text-base text-sky-950 md:text-xl">My Wallet</h3>
      <p className="text-slate-500 text-sm">
        To access this asset, please switch your wallet connection to the appropriate chain.
      </p>
    </Panel>
  )
}
