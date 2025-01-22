import { Token } from '@/domain/types/Token'
import { TokenIcon } from '@/ui/atoms/token-icon/TokenIcon'
import { NormalizedUnitNumber } from '@marsfoundation/common-universal'

export function Projection({ token, value }: { token: Token; value: NormalizedUnitNumber }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="typography-heading-5 flex gap-[1px]">
        <div className="text-feature-savings-primary">+</div>
        <div className="text-primary-inverse">{token.format(value, { style: 'auto' })}</div>
      </div>
      <TokenIcon token={token} className="size-5" />
    </div>
  )
}
