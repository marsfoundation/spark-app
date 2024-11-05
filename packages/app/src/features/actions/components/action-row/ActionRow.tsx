import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { getTokenImage } from '@/ui/assets'
import SuccessIcon from '@/ui/assets/icons/success.svg?react'
import WarningIcon from '@/ui/assets/icons/warning.svg?react'
import { Button } from '@/ui/atoms/new/button/Button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/ui/atoms/new/tooltip/Tooltip'
import { IconStack } from '@/ui/molecules/icon-stack/IconStack'
import { cn } from '@/ui/utils/style'
import { testIds } from '@/ui/utils/testIds'
import { useIsTruncated } from '@/ui/utils/useIsTruncated'
import { assert } from '@/utils/assert'
import { cva } from 'class-variance-authority'
import { ComponentType, ReactNode, createContext, useContext } from 'react'
import { ActionHandlerState } from '../../logic/types'
import { ActionsGridLayout } from '../../types'

export interface ActionRowProps {
  actionIndex: number
  actionHandlerState: ActionHandlerState
  onAction: () => void
  layout: ActionsGridLayout
  children: ReactNode
}

const ActionRowContext = createContext<Omit<ActionRowProps, 'children'> | null>(null)

function useActionRowContext() {
  const context = useContext(ActionRowContext)
  assert(context, 'useActionRowContext must be used within ActionRow')
  return context
}

function ActionRow({ children, actionHandlerState, actionIndex, onAction, layout }: ActionRowProps) {
  return (
    <div
      className={cn(
        'col-span-full grid grid-cols-subgrid items-center',
        'gap-y-3 border-b border-b-primary p-4 last:border-none sm:p-5',
        layout === 'compact' && 'sm:p-4',
      )}
      data-testid={testIds.actions.row(actionIndex)}
    >
      <ActionRowContext.Provider value={{ actionHandlerState, actionIndex, onAction, layout }}>
        {children}
      </ActionRowContext.Provider>
    </div>
  )
}

const iconVariants = cva(
  cn(
    'typography-label-5 grid h-6 w-12 grid-cols-[1fr_1px_1fr] items-center',
    'justify-items-center rounded-xs transition-all delay-500 duration-200 sm:h-8 sm:w-16',
  ),
  {
    variants: {
      variant: {
        disabled: 'bg-secondary text-primary',
        ready: 'bg-brand-primary text-brand-primary',
        loading: 'bg-reskin-orange-600/10 text-reskin-orange-600',
        success: 'bg-system-success-primary text-system-success-primary',
        error: 'bg-system-error-primary text-system-error-primary',
      },
    },
  },
)

function Icon({ icon }: { icon: ComponentType<{ className?: string }> }) {
  const { actionIndex, actionHandlerState } = useActionRowContext()

  const Icon =
    actionHandlerState.status === 'success' ? SuccessIcon : actionHandlerState.status === 'error' ? WarningIcon : icon

  return (
    <div className={cn(iconVariants({ variant: actionHandlerState.status }), actionIndex === 0 && 'delay-0')}>
      <div className="text-primary">{actionIndex + 1}</div>
      <div className="h-full w-px bg-reskin-base-white" />
      <Icon className="icon-xs" />
    </div>
  )
}

function Title({ children }: { children: ReactNode }) {
  const { actionHandlerState } = useActionRowContext()
  const [titleRef, isTruncated] = useIsTruncated()

  return (
    <div
      className={cn(
        'typography-label-4 col-span-2 flex items-center gap-1.5 overflow-x-auto',
        'overflow-y-hidden text-nowrap md:col-span-1 sm:overflow-visible',
        isTruncated &&
          '-ml-2 pr-3 pl-2 [mask-image:linear-gradient(to_right,transparent,black_7%,black_85%,transparent)] sm:[mask-image:none]',
        actionHandlerState.status === 'success' && 'text-secondary',
      )}
      ref={titleRef}
    >
      {children}
    </div>
  )
}

function TitleTokens({ tokens }: { tokens: Token[] }) {
  const { actionHandlerState } = useActionRowContext()
  const icons = tokens.map((token) => getTokenImage(token.symbol))

  return (
    <IconStack
      paths={icons}
      className={cn('shrink-0', actionHandlerState.status === 'success' && 'opacity-60')}
      stackingOrder="last-on-top"
    />
  )
}

// @note: Optional component, displayed only in extended action row layout
function Amount({ token, amount }: { token: Token; amount: NormalizedUnitNumber }) {
  const { actionHandlerState, layout } = useActionRowContext()

  if (layout === 'compact') {
    return null
  }

  return (
    <div
      className={cn(
        'typography-label-4 col-span-full col-start-2 md:col-span-1',
        actionHandlerState.status === 'success' && 'text-secondary',
      )}
    >
      {token.format(amount, { style: 'auto' })}{' '}
      <span className={cn('text-secondary', actionHandlerState.status === 'success' && 'text-tertiary')}>
        {token.symbol}
      </span>
    </div>
  )
}

function ErrorWarning() {
  const { actionHandlerState, layout } = useActionRowContext()
  const [errorTextRef, isTruncated] = useIsTruncated({ enabled: actionHandlerState.status === 'error' })

  if (actionHandlerState.status !== 'error') {
    return null
  }

  return (
    <Tooltip open={!isTruncated ? false : undefined}>
      <TooltipTrigger asChild>
        <div
          className={cn(
            'typography-label-5 typography-label-4 col-span-full col-start-2 inline-flex min-w-0 text-secondary md:col-span-1',
            layout === 'compact' ? 'md:col-start-3' : 'md:col-start-4',
          )}
        >
          <div className="truncate" ref={errorTextRef}>
            {actionHandlerState.message}
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent>{actionHandlerState.message}</TooltipContent>
    </Tooltip>
  )
}

function Trigger({ children }: { children: ReactNode }) {
  const { actionHandlerState, onAction } = useActionRowContext()

  return (
    <div
      className={cn(
        'col-span-full min-w-[5rem] md:col-span-1 md:col-start-[-1] md:w-auto',
        actionHandlerState.status === 'success' && 'hidden md:invisible md:block',
      )}
    >
      <Button
        variant="primary"
        size="m"
        onClick={onAction}
        loading={actionHandlerState.status === 'loading'}
        disabled={actionHandlerState.status === 'disabled'}
        className="w-full"
      >
        {actionHandlerState.status === 'error' ? 'Try Again' : children}
      </Button>
    </div>
  )
}

ActionRow.Icon = Icon
ActionRow.Title = Title
Title.Tokens = TitleTokens
ActionRow.Amount = Amount
ActionRow.ErrorWarning = ErrorWarning
ActionRow.Trigger = Trigger

export { ActionRow }
