import { paths } from '@/config/paths'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { getTokenImage } from '@/ui/assets'
import { LinkButton } from '@/ui/atoms/new/link-button/LinkButton'
import { Panel } from '@/ui/atoms/new/panel/Panel'
import { Typography } from '@/ui/atoms/typography/Typography'
import { IconStack } from '@/ui/molecules/icon-stack/IconStack'
import { cn } from '@/ui/utils/style'

const TOKEN_ICON_PATHS = ['DAI', 'ETH', 'USDC', 'WBTC'].map(TokenSymbol).map(getTokenImage)

interface CreatePositionPanelProps {
  className?: string
}

export function CreatePositionPanel({ className }: CreatePositionPanelProps) {
  return (
    <Panel className={cn('flex flex-col gap-6 text-center', className)}>
      <div className="flex flex-col items-center gap-6 text-center">
        <IconStack paths={TOKEN_ICON_PATHS} size="lg" stackingOrder="first-on-top" />
        <Typography variant="p" className="typography-heading-4 sm:typography-heading-3">
          Quickly deposit your assets and borrow DAI with our Easy Borrow Flow
        </Typography>
      </div>
      <LinkButton to={paths.easyBorrow}>Create position</LinkButton>
    </Panel>
  )
}
