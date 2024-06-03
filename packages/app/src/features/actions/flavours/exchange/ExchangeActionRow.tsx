import { formatPercentage } from '@/domain/common/format'
import { SwapRequest } from '@/domain/exchanges/types'
import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { Token, USD_MOCK_TOKEN } from '@/domain/types/Token'
import { ActionRow } from '@/features/actions/components/action-row/ActionRow'
import { assets, getTokenImage } from '@/ui/assets'
import { IconStack } from '@/ui/molecules/icon-stack/IconStack'
import { testIds } from '@/ui/utils/testIds'

import { UpDownMarker } from '../../components/action-row/UpDownMarker'
import { ActionRowBaseProps } from '../../components/action-row/types'
import { ActionHandlerState } from '../../logic/types'
import { ExchangeAction } from './types'

export interface ExchangeActionRowProps extends ActionRowBaseProps {
  action: ExchangeAction
}

export function ExchangeActionRow({ index, action, actionHandlerState, onAction, variant }: ExchangeActionRowProps) {
  const fromToken = action.swapParams.fromToken
  const toToken = action.swapParams.toToken
  const tokenIconPaths = [getTokenImage(fromToken.symbol), getTokenImage(toToken.symbol)]
  const status = actionHandlerState.status
  const token = action.swapParams.type === 'reverse' ? toToken : fromToken
  const successMessage = `Converted ${token.format(action.value, { style: 'auto' })} ${token.symbol}!`

  return (
    <ActionRow data-testid={testIds.actions.flavours.exchangeActionRow.wrapper}>
      <ActionRow.Index index={index} />

      <ActionRow.Icon path={assets.actions.exchange} actionStatus={status} />

      <ActionRow.Title icon={<IconStack paths={tokenIconPaths} stackingOrder="last-on-top" />} actionStatus={status}>
        Convert {fromToken.symbol} to {toToken.symbol}
      </ActionRow.Title>

      <ActionRow.Description successMessage={successMessage} actionStatus={status} variant={variant}>
        <UpDownMarker
          token={token}
          value={action.value}
          direction={action.swapParams.type === 'reverse' ? 'down' : 'up'}
        />
      </ActionRow.Description>

      <ActionRow.ErrorWarning variant={variant} actionHandlerState={actionHandlerState} />

      <ActionRow.Action onAction={onAction} status={status}>
        Convert
      </ActionRow.Action>

      <RowSummary
        toToken={toToken}
        estimate={action.swapInfo.data?.estimate}
        maxSlippage={action.swapParams.meta.maxSlippage}
        formatAsDAIValue={action.formatAsDAIValue}
        actionStatus={status}
      />
    </ActionRow>
  )
}

interface RowSummaryProps {
  toToken: Token
  estimate: SwapRequest['estimate'] | undefined
  maxSlippage: Percentage
  actionStatus: ActionHandlerState['status']
  formatAsDAIValue?: (amount: NormalizedUnitNumber) => string
}

function RowSummary({ maxSlippage, toToken, estimate, actionStatus, formatAsDAIValue }: RowSummaryProps) {
  if (actionStatus === 'success') {
    return null
  }
  if (estimate === undefined) {
    return (
      <div className="col-span-full inline-flex">
        <LiFiBadge />
      </div>
    )
  }

  const amount = toToken.fromBaseUnit(estimate.toAmount)

  return (
    <div className="col-span-full mt-1 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <LiFiBadge />
        <p className="text-basics-black text-xs">
          <span className="text-basics-dark-grey">Extra fee: </span>
          <span data-testid={testIds.actions.flavours.exchangeActionRow.fee}>{USD_MOCK_TOKEN.formatUSD(estimate.feeCostsUSD)}</span>
          <br />
          <span className="text-basics-dark-grey">Slippage: </span>
          <span data-testid={testIds.actions.flavours.exchangeActionRow.slippage}>
            {formatPercentage(maxSlippage, { minimumFractionDigits: 1 })}
          </span>
        </p>
      </div>
      <p className="text-basics-dark-grey text-xs">
        <span className="hidden sm:inline">You'll get</span> ~<span data-testid={testIds.actions.flavours.exchangeActionRow.finalSDAIAmount}>{toToken.format(amount, { style: 'auto' })}{' '}{toToken.symbol}</span>
        {formatAsDAIValue && <span data-testid={testIds.actions.flavours.exchangeActionRow.finalDAIAmount}> (${formatAsDAIValue(amount)} DAI)</span>}
      </p>
    </div>
  )
}

function LiFiBadge() {
  return (
    <p className="mr-auto flex items-center gap-1.5 rounded bg-basics-dark-grey/20 px-1.5 py-0.5 font-semibold text-[9px] text-basics-black tracking-wide" data-testid={testIds.actions.flavours.exchangeActionRow.lifiBadge}>
      <img src={assets.lifiLogo} alt="LI.FI logo" className="h-3" />
      <span className="hidden md:block">POWERED</span> BY LI.FI
    </p>
  )
}
