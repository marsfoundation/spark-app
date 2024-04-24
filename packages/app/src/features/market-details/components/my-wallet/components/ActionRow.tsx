import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { Button } from '@/ui/atoms/button/Button'

import { ActionDetails } from './ActionDetails'

interface ActionRowProps {
  token: Token
  value: NormalizedUnitNumber
  label: string
  buttonText: string
  onAction: () => void
}

export function ActionRow({ token, value, label, buttonText, onAction }: ActionRowProps) {
  return (
    <div className="grid grid-cols-[_1fr,_70px] border-t border-slate-700/10 py-4">
      <ActionDetails label={label} token={token} value={value} />
      <Button disabled={value.isZero()} size="sm" onClick={onAction}>
        {buttonText}
      </Button>
    </div>
  )
}
