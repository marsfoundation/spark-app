import { paths } from '@/config/paths'
import { TokenWithValue } from '@/domain/common/types'
import { SuccessViewPanelTitle } from '@/features/dialogs/common/components/success-view/SuccessPanelTitle'
import { SuccessViewCheckmark } from '@/features/dialogs/common/components/success-view/SuccessViewCheckmark'
import { SuccessViewPanel } from '@/features/dialogs/common/components/success-view/SuccessViewPanel'
import { SuccessViewTokenRow } from '@/features/dialogs/common/components/success-view/SuccessViewTokenRow'
import { LinkButton } from '@/ui/atoms/new/link-button/LinkButton'
import { Panel } from '@/ui/atoms/new/panel/Panel'
import { PageLayout } from '@/ui/layouts/PageLayout'
import { Confetti } from '@/ui/molecules/confetti/Confetti'
import { cn } from '@/ui/utils/style'
import { testIds } from '@/ui/utils/testIds'
import { useBreakpoint } from '@/ui/utils/useBreakpoint'
import { UsdsUpgradeAlert } from '../components/UsdsUpgradeAlert'
import { BorrowDetails } from '../logic/useEasyBorrow'

export interface SuccessViewProps {
  deposited: TokenWithValue[]
  borrowed: TokenWithValue[]
  borrowDetails: BorrowDetails
  runConfetti: boolean
}

export function SuccessView({ deposited, borrowed, runConfetti, borrowDetails }: SuccessViewProps) {
  const desktop = useBreakpoint('md')

  return (
    <PageLayout className={cn('pt-8', desktop && 'pt-28')}>
      <Confetti run={runConfetti} recycle={false} numberOfPieces={1000} data-testid="react-confetti" />
      <Panel>
        <SuccessViewCheckmark />
        <SuccessViewPanel>
          <div className={cn('mt-4 flex flex-col gap-9', 'md:flex-row')}>
            {deposited.length > 0 && (
              <div className="flex grow flex-col" data-testid={testIds.easyBorrow.success.deposited}>
                <SuccessViewPanelTitle>Deposited</SuccessViewPanelTitle>
                {deposited.map(({ token, value }) => (
                  <SuccessViewTokenRow key={token.symbol} token={token} amount={value} />
                ))}
              </div>
            )}
            <div className="flex grow flex-col" data-testid={testIds.easyBorrow.success.borrowed}>
              <SuccessViewPanelTitle>Borrowed</SuccessViewPanelTitle>
              {borrowed.map(({ token, value }) => (
                <SuccessViewTokenRow key={token.symbol} token={token} amount={value} />
              ))}
            </div>
          </div>
          {borrowDetails.isUpgradingToUsds && (
            <UsdsUpgradeAlert borrowDetails={borrowDetails} variant="success" className="mt-2" />
          )}
          <LinkButton size="l" className="mt-8 w-full" to={paths.myPortfolio}>
            View in portfolio
          </LinkButton>
        </SuccessViewPanel>
      </Panel>
    </PageLayout>
  )
}
