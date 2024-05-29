import { Button } from '@/ui/atoms/button/Button'
import { Panel } from '@/ui/atoms/panel/Panel'
import { IconStack } from '@/ui/molecules/icon-stack/IconStack'

interface WalletActionPanelProps {
  iconPaths: string[]
  callToAction: string
  actionButtonTitle: string
  walletAction: () => void
}

export function WalletActionPanel({
  walletAction,
  iconPaths,
  callToAction,
  actionButtonTitle,
}: WalletActionPanelProps) {
  return (
    <Panel.Wrapper>
      <Panel.Content className="flex flex-col gap-6 p-6 text-center md:px-8">
        <div className="flex flex-col items-center gap-6">
          <IconStack paths={iconPaths} size="lg" stackingOrder="first-on-top" />
          <h4 className='font-semibold text-lg leading-loose sm:text-xl'>{callToAction}</h4>
        </div>
        <Button onClick={walletAction}>{actionButtonTitle}</Button>
      </Panel.Content>
    </Panel.Wrapper>
  )
}
