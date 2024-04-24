import { ReactNode } from 'react'

import { assets } from '@/ui/assets'
import { Tooltip, TooltipContentShort, TooltipTrigger } from '@/ui/atoms/tooltip/Tooltip'
import { ActionButton } from '@/ui/molecules/action-button/ActionButton'
import { cn } from '@/ui/utils/style'
import { testIds } from '@/ui/utils/testIds'
import { useIsTruncated } from '@/ui/utils/useIsTruncated'

import { ActionHandlerState } from '../../logic/types'
import { ActionRowVariant } from './types'

function ActionRow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'border-basics-dark-grey/20 col-span-full grid min-h-[65px] grid-cols-subgrid items-center gap-y-2 border-b py-4 last:border-none',
        className,
      )}
    >
      {children}
    </div>
  )
}

function Index({ index }: { index: number }) {
  return <div className="text-basics-dark-grey text-xs tabular-nums">{index}.</div>
}

function Icon({ path, actionStatus }: { path: string; actionStatus?: ActionHandlerState['status'] }) {
  if (actionStatus === 'success') {
    return <img src={assets.actions.done} alt="action-success-icon" className="h-4 w-4 shrink-0" />
  }
  return <img src={path} alt="action-icon" className="h-4 w-4 shrink-0" />
}

function Title({
  children,
  icon,
  actionStatus,
}: {
  children: ReactNode
  icon?: ReactNode
  actionStatus: ActionHandlerState['status']
}) {
  return (
    <div
      className="col-span-2 flex items-center justify-between gap-1.5 md:col-span-1 md:justify-start"
      data-testid={testIds.component.Action.title}
    >
      {icon && <div className="order-2 md:order-1">{icon}</div>}
      <p
        className={cn(
          'text-basics-black order-1 text-base md:order-2',
          actionStatus === 'success' && 'text-basics-dark-grey',
        )}
      >
        {children}
      </p>
    </div>
  )
}

function Description({
  children,
  successMessage,
  actionStatus,
  variant,
}: {
  children?: ReactNode
  successMessage: string
  actionStatus: ActionHandlerState['status']
  variant: ActionRowVariant
}) {
  if (variant === 'compact') {
    return null
  }

  // success row message
  if (actionStatus === 'success') {
    return (
      <div className="text-basics-dark-grey col-span-full col-start-3 text-sm md:col-span-1 md:ml-10">
        {successMessage}
      </div>
    )
  }

  // description
  if (['disabled', 'ready', 'loading'].includes(actionStatus)) {
    return (
      <div className="text-basics-dark-grey col-span-full col-start-3 text-sm md:col-span-1 md:ml-10">{children}</div>
    )
  }

  return null
}

function ErrorWarning({
  variant,
  actionHandlerState,
}: {
  variant: ActionRowVariant
  actionHandlerState: ActionHandlerState
}) {
  if (variant === 'compact') {
    return <ErrorWarningCompact actionHandlerState={actionHandlerState} />
  }
  return <ErrorWarningExtended actionHandlerState={actionHandlerState} />
}

function ErrorWarningExtended({ actionHandlerState }: { actionHandlerState: ActionHandlerState }) {
  const [errorTextRef, isTruncated] = useIsTruncated()
  if (actionHandlerState.status !== 'error') {
    return null
  }

  return (
    <Tooltip open={!isTruncated ? false : undefined}>
      <TooltipTrigger asChild>
        <div className="col-span-full col-start-3 inline-flex min-w-0 md:col-span-1 md:ml-10">
          <div className="mr-auto flex w-full items-center">
            <img src={assets.warning} alt="warning" className="h-5 w-5" />
            <strong className="text-product-red ml-0.5 text-xs font-semibold">Error:</strong>
            <p className="text-basics-dark-grey ml-1 truncate text-xs" ref={errorTextRef}>
              {actionHandlerState.message}
            </p>
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContentShort>{actionHandlerState.message}</TooltipContentShort>
    </Tooltip>
  )
}

function ErrorWarningCompact({ actionHandlerState }: { actionHandlerState: ActionHandlerState }) {
  if (actionHandlerState.status !== 'error') {
    return null
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="col-span-full col-start-3 inline-flex items-center md:col-span-1 md:ml-auto md:mr-2">
          <img src={assets.warning} alt="warning" className="h-5 w-5" />
          <strong className="text-product-red ml-0.5 text-xs font-semibold">Error</strong>
        </div>
      </TooltipTrigger>
      <TooltipContentShort>{actionHandlerState.message}</TooltipContentShort>
    </Tooltip>
  )
}

function Action({
  children,
  status,
  onAction,
}: {
  children: ReactNode
  status: ActionHandlerState['status']
  onAction: () => void
}) {
  return (
    <ActionButton
      className={cn(
        'col-span-full ml-auto w-full min-w-[5rem] md:col-span-1 md:col-start-[-1] md:w-auto',
        status === 'success' && 'hidden md:invisible',
      )}
      size="sm"
      isLoading={status === 'loading'}
      disabled={status === 'disabled'}
      onClick={onAction}
    >
      {children}
    </ActionButton>
  )
}

ActionRow.Index = Index
ActionRow.Icon = Icon
ActionRow.Title = Title
ActionRow.Description = Description
ActionRow.ErrorWarning = ErrorWarning
ActionRow.Action = Action

export { ActionRow }
