import { paths } from '@/config/paths'
import { TokenWithValue } from '@/domain/common/types'
import { SuccessViewPanelTitle } from '@/features/dialogs/common/components/success-view/SuccessPanelTitle'
import { SuccessViewCheckmark } from '@/features/dialogs/common/components/success-view/SuccessViewCheckmark'
import { SuccessViewPanel } from '@/features/dialogs/common/components/success-view/SuccessViewPanel'
import { SuccessViewTokenRow } from '@/features/dialogs/common/components/success-view/SuccessViewTokenRow'
import { LinkButton } from '@/ui/atoms/link-button/LinkButton'
import { Panel } from '@/ui/atoms/panel/Panel'
import { PageLayout } from '@/ui/layouts/PageLayout'
import { Confetti } from '@/ui/molecules/confetti/Confetti'
import { cn } from '@/ui/utils/style'
import { testIds } from '@/ui/utils/testIds'

export interface SuccessViewProps {
  deposited: TokenWithValue[]
  borrowed: TokenWithValue[]
  runConfetti: boolean
}

export function SuccessView({ deposited, borrowed, runConfetti }: SuccessViewProps) {
  return (
    <PageLayout className="items-center justify-center">
      <Confetti run={runConfetti} recycle={false} numberOfPieces={1000} data-testid="react-confetti" />
      <Panel className="w-full max-w-3xl">
        <SuccessViewCheckmark />
        <SuccessViewPanel>
          <div className={cn('mt-4 flex flex-col gap-4 md:flex-row md:gap-9')}>
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
          <LinkButton size="l" className="mt-8 w-full" to={paths.myPortfolio}>
            View in portfolio
          </LinkButton>
        </SuccessViewPanel>
      </Panel>
    </PageLayout>
  )
}
