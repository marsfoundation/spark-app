import { WithClassname, WithTooltipProvider } from '@sb/decorators'
import { getMobileStory, getTabletStory } from '@sb/viewports'
import { Meta, StoryObj } from '@storybook/react'

import { ActionsGrid } from '../ActionsGrid'
import { allActionHandlers } from './allActionHandlers'

const meta: Meta<typeof ActionsGrid> = {
  title: 'Features/Actions/ActionsGrid/AllHandlersStates',
  component: ActionsGrid,
  decorators: [WithTooltipProvider(), WithClassname('max-w-3xl')],
}

export default meta
type Story = StoryObj<typeof ActionsGrid>

const message = 'Transaction rejected by user. This is lengthy error message. Layout test.'

// Extended variant
export const ApproveExtended: Story = {
  name: 'Approve (Extended)',
  args: {
    actionHandlers: [
      { ...allActionHandlers.approve, state: { status: 'ready' } },
      { ...allActionHandlers.approve, state: { status: 'loading' } },
      { ...allActionHandlers.approve, state: { status: 'success' } },
      { ...allActionHandlers.approve, state: { status: 'disabled' } },
      { ...allActionHandlers.approve, state: { status: 'error', message } },
    ],
    variant: 'extended',
  },
}
export const ApproveExtendedMobile = { name: 'Approve (Extended, Mobile)', ...getMobileStory(ApproveExtended) }
export const ApproveExtendedTablet = { name: 'Approve (Extended, Tablet)', ...getTabletStory(ApproveExtended) }

export const PermitExtended: Story = {
  name: 'Permit (Extended)',
  args: {
    actionHandlers: [
      { ...allActionHandlers.permit, state: { status: 'ready' } },
      { ...allActionHandlers.permit, state: { status: 'loading' } },
      { ...allActionHandlers.permit, state: { status: 'success' } },
      { ...allActionHandlers.permit, state: { status: 'disabled' } },
      { ...allActionHandlers.permit, state: { status: 'error', message } },
    ],
    variant: 'extended',
  },
}
export const PermitExtendedMobile = { name: 'Permit (Extended, Mobile)', ...getMobileStory(PermitExtended) }
export const PermitExtendedTablet = { name: 'Permit (Extended, Tablet)', ...getTabletStory(PermitExtended) }

export const ApproveDelegationExtended: Story = {
  name: 'Approve Delegation (Extended)',
  args: {
    actionHandlers: [
      { ...allActionHandlers.approveDelegation, state: { status: 'ready' } },
      { ...allActionHandlers.approveDelegation, state: { status: 'loading' } },
      { ...allActionHandlers.approveDelegation, state: { status: 'success' } },
      { ...allActionHandlers.approveDelegation, state: { status: 'disabled' } },
      { ...allActionHandlers.approveDelegation, state: { status: 'error', message } },
    ],
    variant: 'extended',
  },
}
export const ApproveDelegationExtendedMobile = {
  name: 'Approve Delegation (Extended, Mobile)',
  ...getMobileStory(ApproveDelegationExtended),
}
export const ApproveDelegationExtendedTablet = {
  name: 'Approve Delegation (Extended, Tablet)',
  ...getTabletStory(ApproveDelegationExtended),
}

export const BorrowExtended: Story = {
  name: 'Borrow (Extended)',
  args: {
    actionHandlers: [
      { ...allActionHandlers.borrow, state: { status: 'ready' } },
      { ...allActionHandlers.borrow, state: { status: 'loading' } },
      { ...allActionHandlers.borrow, state: { status: 'success' } },
      { ...allActionHandlers.borrow, state: { status: 'disabled' } },
      { ...allActionHandlers.borrow, state: { status: 'error', message } },
    ],
    variant: 'extended',
  },
}
export const BorrowExtendedMobile = { name: 'Borrow (Extended, Mobile)', ...getMobileStory(BorrowExtended) }
export const BorrowExtendedTablet = { name: 'Borrow (Extended, Tablet)', ...getTabletStory(BorrowExtended) }

export const DepositExtended: Story = {
  name: 'Deposit (Extended)',
  args: {
    actionHandlers: [
      { ...allActionHandlers.deposit, state: { status: 'ready' } },
      { ...allActionHandlers.deposit, state: { status: 'loading' } },
      { ...allActionHandlers.deposit, state: { status: 'success' } },
      { ...allActionHandlers.deposit, state: { status: 'disabled' } },
      { ...allActionHandlers.deposit, state: { status: 'error', message } },
    ],
    variant: 'extended',
  },
}
export const DepositExtendedMobile = { name: 'Deposit (Extended, Mobile)', ...getMobileStory(DepositExtended) }
export const DepositExtendedTablet = { name: 'Deposit (Extended, Tablet)', ...getTabletStory(DepositExtended) }

export const RepayExtended: Story = {
  name: 'Repay (Extended)',
  args: {
    actionHandlers: [
      { ...allActionHandlers.repay, state: { status: 'ready' } },
      { ...allActionHandlers.repay, state: { status: 'loading' } },
      { ...allActionHandlers.repay, state: { status: 'success' } },
      { ...allActionHandlers.repay, state: { status: 'disabled' } },
      { ...allActionHandlers.repay, state: { status: 'error', message } },
    ],
    variant: 'extended',
  },
}
export const RepayExtendedMobile = { name: 'Repay (Extended, Mobile)', ...getMobileStory(RepayExtended) }
export const RepayExtendedTablet = { name: 'Repay (Extended, Tablet)', ...getTabletStory(RepayExtended) }

export const SetUseAsCollateralExtended: Story = {
  name: 'Set Use As Collateral (Extended)',
  args: {
    actionHandlers: [
      { ...allActionHandlers.setUseAsCollateral, state: { status: 'ready' } },
      { ...allActionHandlers.setUseAsCollateral, state: { status: 'loading' } },
      { ...allActionHandlers.setUseAsCollateral, state: { status: 'success' } },
      { ...allActionHandlers.setUseAsCollateral, state: { status: 'disabled' } },
      { ...allActionHandlers.setUseAsCollateral, state: { status: 'error', message } },
    ],
    variant: 'extended',
  },
}
export const SetUseAsCollateralExtendedMobile = {
  name: 'Set Use As Collateral (Extended, Mobile)',
  ...getMobileStory(SetUseAsCollateralExtended),
}
export const SetUseAsCollateralExtendedTablet = {
  name: 'Set Use As Collateral (Extended, Tablet)',
  ...getTabletStory(SetUseAsCollateralExtended),
}

export const SetUserEModeExtended: Story = {
  name: 'Set User EMode (Extended)',
  args: {
    actionHandlers: [
      { ...allActionHandlers.setUserEMode, state: { status: 'ready' } },
      { ...allActionHandlers.setUserEMode, state: { status: 'loading' } },
      { ...allActionHandlers.setUserEMode, state: { status: 'success' } },
      { ...allActionHandlers.setUserEMode, state: { status: 'disabled' } },
      { ...allActionHandlers.setUserEMode, state: { status: 'error', message } },
    ],
    variant: 'extended',
  },
}
export const SetUserEModeExtendedMobile = {
  name: 'Set User EMode (Extended, Mobile)',
  ...getMobileStory(SetUserEModeExtended),
}
export const SetUserEModeExtendedTablet = {
  name: 'Set User EMode (Extended, Tablet)',
  ...getTabletStory(SetUserEModeExtended),
}

export const WithdrawExtended: Story = {
  name: 'Withdraw (Extended)',
  args: {
    actionHandlers: [
      { ...allActionHandlers.withdraw, state: { status: 'ready' } },
      { ...allActionHandlers.withdraw, state: { status: 'loading' } },
      { ...allActionHandlers.withdraw, state: { status: 'success' } },
      { ...allActionHandlers.withdraw, state: { status: 'disabled' } },
      { ...allActionHandlers.withdraw, state: { status: 'error', message } },
    ],
    variant: 'extended',
  },
}
export const WithdrawExtendedMobile = { name: 'Withdraw (Extended, Mobile)', ...getMobileStory(WithdrawExtended) }
export const WithdrawExtendedTablet = { name: 'Withdraw (Extended, Tablet)', ...getTabletStory(WithdrawExtended) }

// Compact variant
export const ApproveCompact: Story = {
  name: 'Approve (Compact)',
  args: {
    actionHandlers: [
      { ...allActionHandlers.approve, state: { status: 'ready' } },
      { ...allActionHandlers.approve, state: { status: 'loading' } },
      { ...allActionHandlers.approve, state: { status: 'success' } },
      { ...allActionHandlers.approve, state: { status: 'disabled' } },
      { ...allActionHandlers.approve, state: { status: 'error', message } },
    ],
    variant: 'compact',
  },
}
export const ApproveCompactMobile = { name: 'Approve (Compact, Mobile)', ...getMobileStory(ApproveCompact) }
export const ApproveCompactTablet = { name: 'Approve (Compact, Tablet)', ...getTabletStory(ApproveCompact) }

export const PermitCompact: Story = {
  name: 'Permit (Compact)',
  args: {
    actionHandlers: [
      { ...allActionHandlers.permit, state: { status: 'ready' } },
      { ...allActionHandlers.permit, state: { status: 'loading' } },
      { ...allActionHandlers.permit, state: { status: 'success' } },
      { ...allActionHandlers.permit, state: { status: 'disabled' } },
      { ...allActionHandlers.permit, state: { status: 'error', message } },
    ],
    variant: 'compact',
  },
}
export const PermitCompactMobile = { name: 'Permit (Compact, Mobile)', ...getMobileStory(PermitCompact) }
export const PermitCompactTablet = { name: 'Permit (Compact, Tablet)', ...getTabletStory(PermitCompact) }

export const ApproveDelegationCompact: Story = {
  name: 'Approve Delegation (Compact)',
  args: {
    actionHandlers: [
      { ...allActionHandlers.approveDelegation, state: { status: 'ready' } },
      { ...allActionHandlers.approveDelegation, state: { status: 'loading' } },
      { ...allActionHandlers.approveDelegation, state: { status: 'success' } },
      { ...allActionHandlers.approveDelegation, state: { status: 'disabled' } },
      { ...allActionHandlers.approveDelegation, state: { status: 'error', message } },
    ],
    variant: 'compact',
  },
}
export const ApproveDelegationCompactMobile = {
  name: 'Approve Delegation (Compact, Mobile)',
  ...getMobileStory(ApproveDelegationCompact),
}
export const ApproveDelegationCompactTablet = {
  name: 'Approve Delegation (Compact, Tablet)',
  ...getTabletStory(ApproveDelegationCompact),
}

export const BorrowCompact: Story = {
  name: 'Borrow (Compact)',
  args: {
    actionHandlers: [
      { ...allActionHandlers.borrow, state: { status: 'ready' } },
      { ...allActionHandlers.borrow, state: { status: 'loading' } },
      { ...allActionHandlers.borrow, state: { status: 'success' } },
      { ...allActionHandlers.borrow, state: { status: 'disabled' } },
      { ...allActionHandlers.borrow, state: { status: 'error', message } },
    ],
    variant: 'compact',
  },
}
export const BorrowCompactMobile = { name: 'Borrow (Compact, Mobile)', ...getMobileStory(BorrowCompact) }
export const BorrowCompactTablet = { name: 'Borrow (Compact, Tablet)', ...getTabletStory(BorrowCompact) }

export const DepositCompact: Story = {
  name: 'Deposit (Compact)',
  args: {
    actionHandlers: [
      { ...allActionHandlers.deposit, state: { status: 'ready' } },
      { ...allActionHandlers.deposit, state: { status: 'loading' } },
      { ...allActionHandlers.deposit, state: { status: 'success' } },
      { ...allActionHandlers.deposit, state: { status: 'disabled' } },
      { ...allActionHandlers.deposit, state: { status: 'error', message } },
    ],
    variant: 'compact',
  },
}
export const DepositCompactMobile = { name: 'Deposit (Compact, Mobile)', ...getMobileStory(DepositCompact) }
export const DepositCompactTablet = { name: 'Deposit (Compact, Tablet)', ...getTabletStory(DepositCompact) }

export const RepayCompact: Story = {
  name: 'Repay (Compact)',
  args: {
    actionHandlers: [
      { ...allActionHandlers.repay, state: { status: 'ready' } },
      { ...allActionHandlers.repay, state: { status: 'loading' } },
      { ...allActionHandlers.repay, state: { status: 'success' } },
      { ...allActionHandlers.repay, state: { status: 'disabled' } },
      { ...allActionHandlers.repay, state: { status: 'error', message } },
    ],
    variant: 'compact',
  },
}
export const RepayCompactMobile = { name: 'Repay (Compact, Mobile)', ...getMobileStory(RepayCompact) }
export const RepayCompactTablet = { name: 'Repay (Compact, Tablet)', ...getTabletStory(RepayCompact) }

export const SetUseAsCollateralCompact: Story = {
  name: 'Set Use As Collateral (Compact)',
  args: {
    actionHandlers: [
      { ...allActionHandlers.setUseAsCollateral, state: { status: 'ready' } },
      { ...allActionHandlers.setUseAsCollateral, state: { status: 'loading' } },
      { ...allActionHandlers.setUseAsCollateral, state: { status: 'success' } },
      { ...allActionHandlers.setUseAsCollateral, state: { status: 'disabled' } },
      { ...allActionHandlers.setUseAsCollateral, state: { status: 'error', message } },
    ],
    variant: 'compact',
  },
}
export const SetUseAsCollateralCompactMobile = {
  name: 'Set Use As Collateral (Compact, Mobile)',
  ...getMobileStory(SetUseAsCollateralCompact),
}
export const SetUseAsCollateralCompactTablet = {
  name: 'Set Use As Collateral (Compact, Tablet)',
  ...getTabletStory(SetUseAsCollateralCompact),
}

export const SetUserEModeCompact: Story = {
  name: 'Set User EMode (Compact)',
  args: {
    actionHandlers: [
      { ...allActionHandlers.setUserEMode, state: { status: 'ready' } },
      { ...allActionHandlers.setUserEMode, state: { status: 'loading' } },
      { ...allActionHandlers.setUserEMode, state: { status: 'success' } },
      { ...allActionHandlers.setUserEMode, state: { status: 'disabled' } },
      { ...allActionHandlers.setUserEMode, state: { status: 'error', message } },
    ],
    variant: 'compact',
  },
}
export const SetUserEModeCompactMobile = {
  name: 'Set User EMode (Compact, Mobile)',
  ...getMobileStory(SetUserEModeCompact),
}
export const SetUserEModeCompactTablet = {
  name: 'Set User EMode (Compact, Tablet)',
  ...getTabletStory(SetUserEModeCompact),
}

export const WithdrawCompact: Story = {
  name: 'Withdraw (Compact)',
  args: {
    actionHandlers: [
      { ...allActionHandlers.withdraw, state: { status: 'ready' } },
      { ...allActionHandlers.withdraw, state: { status: 'loading' } },
      { ...allActionHandlers.withdraw, state: { status: 'success' } },
      { ...allActionHandlers.withdraw, state: { status: 'disabled' } },
      { ...allActionHandlers.withdraw, state: { status: 'error', message } },
    ],
    variant: 'compact',
  },
}
export const WithdrawCompactMobile = { name: 'Withdraw (Compact, Mobile)', ...getMobileStory(WithdrawCompact) }
export const WithdrawCompactTablet = { name: 'Withdraw (Compact, Tablet)', ...getTabletStory(WithdrawCompact) }
