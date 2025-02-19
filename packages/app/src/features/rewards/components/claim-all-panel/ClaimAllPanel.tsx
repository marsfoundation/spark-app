import { TokenWithValue } from '@/domain/common/types'
import { Token } from '@/domain/types/Token'
import { USD_MOCK_TOKEN } from '@/domain/types/Token'
import { hasTokenImage } from '@/ui/assets'
import { Button } from '@/ui/atoms/button/Button'
import { Panel } from '@/ui/atoms/panel/Panel'
import { TokenIcon } from '@/ui/atoms/token-icon/TokenIcon'
import { IconStack } from '@/ui/molecules/icon-stack/IconStack'
import { Info } from '@/ui/molecules/info/Info'
import { NormalizedUnitNumber, raise } from '@marsfoundation/common-universal'

export interface ClaimAllPanelProps {
  tokensToClaim: TokenWithValue[]
}

export function ClaimAllPanel({ tokensToClaim }: ClaimAllPanelProps) {
  const nonZeroPriceTokens = tokensToClaim.filter(({ token, value }) => token.toUSD(value).gt(0))
  const zeroPriceTokens = tokensToClaim.filter(({ token, value }) => token.toUSD(value).eq(0))

  const usdSum = nonZeroPriceTokens.reduce((acc, { token, value }) => {
    return NormalizedUnitNumber(acc.plus(token.toUSD(value)))
  }, NormalizedUnitNumber(0))

  return (
    <Panel variant="secondary" spacing="none" className="rounded-md p-2">
      <Panel variant="quaternary" spacing="none" className="py-12">
        {usdSum.gt(0) && (
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-1">
              <div className="typography-label-2 text-tertiary">Total to claim</div>
              <Info>Sum of all rewards available to claim in USD.</Info>
            </div>
            <div className="flex items-center gap-2">
              <div className="typography-heading-2 text-primary-inverse">{USD_MOCK_TOKEN.formatUSD(usdSum)}</div>
              <IconStack size="m" items={nonZeroPriceTokens.map(({ token }) => token)} />
            </div>
            <div className="flex flex-col gap-2">
              {zeroPriceTokens.map(({ token, value }) => (
                <div key={token.symbol} className="typography-label-2 flex items-center gap-1 text-tertiary">
                  +{token.format(value, { style: 'compact' })}{' '}
                  <TokenIconOrSymbol token={token} iconClassName="size-4" />
                </div>
              ))}
            </div>
          </div>
        )}
        {usdSum.eq(0) && (
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-1">
              <div className="typography-label-2 text-tertiary">Total to claim</div>
              <Info>All tokens you can claim.</Info>
            </div>
            {zeroPriceTokens.length === 1 ? (
              <OneTokenWithoutPrice tokens={zeroPriceTokens} />
            ) : (
              <MultipleTokensWithoutPrice tokens={zeroPriceTokens} />
            )}
          </div>
        )}
      </Panel>
      <div className="flex flex-col gap-2 p-4">
        <Button variant="primary" className="w-full">
          Claim all
        </Button>
      </div>
    </Panel>
  )
}

function OneTokenWithoutPrice({ tokens }: { tokens: TokenWithValue[] }) {
  const { token, value } = tokens[0] ?? raise('No token to display')

  return (
    <div className="typography-heading-2 flex items-center gap-2 text-primary-inverse">
      <div>{token.format(value, { style: 'compact' })}</div>
      <TokenIconOrSymbol token={token} iconClassName="size-8" />
    </div>
  )
}

function MultipleTokensWithoutPrice({ tokens }: { tokens: TokenWithValue[] }) {
  return (
    <div className="flex flex-col gap-2">
      {tokens.map(({ token, value }) => (
        <div key={token.symbol} className="typography-heading-4 flex items-center gap-1 text-primary-inverse">
          {token.format(value, { style: 'compact' })} <TokenIconOrSymbol token={token} iconClassName="size-6" />
        </div>
      ))}
    </div>
  )
}
function TokenIconOrSymbol({ token, iconClassName }: { token: Token; iconClassName?: string }) {
  return hasTokenImage(token.symbol) ? <TokenIcon token={token} className={iconClassName} /> : token.symbol
}
