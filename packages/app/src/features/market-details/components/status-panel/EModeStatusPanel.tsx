import { paths } from '@/config/paths'
import { formatPercentage } from '@/domain/common/format'
import { eModeCategoryIdToName } from '@/domain/e-mode/constants'
import { EModeCategoryId } from '@/domain/e-mode/types'
import { Token } from '@/domain/types/Token'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { assets } from '@/ui/assets'
import { Link } from '@/ui/atoms/link/Link'
import { links } from '@/ui/constants/links'
import { EModeBadge } from '@/ui/molecules/e-mode-badge/EModeBadge'
import { InfoTile } from '@/ui/molecules/info-tile/InfoTile'
import { cn } from '@/ui/utils/style'
import { Percentage } from '@marsfoundation/common-universal'
import { Header } from './components/Header'
import { InfoTilesGrid } from './components/InfoTilesGrid'
import { StatusPanelGrid } from './components/StatusPanelGrid'
import { StatusIcon } from './components/status-icon/StatusIcon'
import { TokenBadge } from './components/token-badge/TokenBadge'

export interface EModeStatusPanelProps {
  maxLtv: Percentage
  liquidationThreshold: Percentage
  liquidationPenalty: Percentage
  categoryId: EModeCategoryId
  eModeCategoryTokens: TokenSymbol[]
  token?: Token
}

export function EModeStatusPanel({
  maxLtv,
  liquidationThreshold,
  liquidationPenalty,
  categoryId,
  eModeCategoryTokens,
  token,
}: EModeStatusPanelProps) {
  const categoryName = eModeCategoryIdToName[categoryId]

  return (
    <StatusPanelGrid>
      <StatusIcon status="yes" />
      <Header status="yes" variant="e-mode" />
      {token && <TokenBadge symbol={token.symbol} />}
      <InfoTilesGrid>
        <InfoTile>
          <InfoTile.Label>Max LTV</InfoTile.Label>
          <InfoTile.Value>
            <WithArrow>{formatPercentage(maxLtv)}</WithArrow>
          </InfoTile.Value>
        </InfoTile>
        <InfoTile>
          <InfoTile.Label>Liquidation threshold</InfoTile.Label>
          <InfoTile.Value>
            <WithArrow>{formatPercentage(liquidationThreshold)}</WithArrow>
          </InfoTile.Value>
        </InfoTile>
        <InfoTile>
          <InfoTile.Label>Liquidation penalty</InfoTile.Label>
          <InfoTile.Value>
            <WithArrow reverseArrow>{formatPercentage(liquidationPenalty)}</WithArrow>
          </InfoTile.Value>
        </InfoTile>
        <InfoTile>
          <InfoTile.Label>Category</InfoTile.Label>
          <InfoTile.Value>
            <EModeBadge categoryId={categoryId} />
          </InfoTile.Value>
        </InfoTile>
        <p className="col-span-1 text-slate-500 text-xs sm:col-span-3">
          E-Mode for {categoryName} assets increases your LTV within the {categoryName} category. This means that when
          E-Mode is enabled, you will have higher borrowing power for assets in this category:{' '}
          {eModeCategoryTokens.join(', ')}. You can enter E-Mode from your{' '}
          <Link to={paths.myPortfolio}>My portfolio</Link>. To learn more about E-Mode and its applied restrictions,
          visit the{' '}
          <Link to={links.docs.eMode} external>
            FAQ
          </Link>{' '}
          or the{' '}
          <Link to={links.aaveTechnicalPaper} external>
            Aave V3 Technical Paper
          </Link>
          .
        </p>
      </InfoTilesGrid>
    </StatusPanelGrid>
  )
}

interface WithArrowProps {
  children: React.ReactNode
  reverseArrow?: boolean
}
function WithArrow({ children, reverseArrow }: WithArrowProps) {
  return (
    <div className="flex min-w-[72px] flex-row justify-between gap-1 sm:min-w-fit">
      <img src={assets.greenArrowUp} className={cn('h-4 w-4', reverseArrow && 'rotate-180')} />
      {children}
    </div>
  )
}
