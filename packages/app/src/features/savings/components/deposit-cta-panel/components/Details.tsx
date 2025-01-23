import { getTokenImage } from '@/ui/assets'
import { Link } from '@/ui/atoms/link/Link'
import { IconStack } from '@/ui/molecules/icon-stack/IconStack'
import { cva } from 'class-variance-authority'
import { ChevronsRight } from 'lucide-react'
import { savingsTokenToAccountType } from '../../common/utils'
import { DepositCTAPanelProps } from '../DepositCTAPanel'

export type DetailsProps = Pick<DepositCTAPanelProps, 'description' | 'inputTokens' | 'savingsToken'>

export function Details({ description, inputTokens, savingsToken }: DetailsProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className={tokensRouteVariants({ bg: savingsTokenToAccountType(savingsToken) })}>
        <IconStack
          paths={inputTokens.map((token) => getTokenImage(token.symbol))}
          iconBorder={{ borderColorClass: 'border-[#1E3B33]' }}
        />
        <ChevronsRight className="icon-xs icon-primary-inverse" />
        <IconStack
          paths={[getTokenImage(savingsToken.symbol)]}
          iconBorder={{ borderColorClass: 'border-transparent' }}
        />
      </div>
      <div className="typography-body-3 max-w-96 text-tertiary">
        {description.text}{' '}
        <Link to={description.docsLink} className="text-savings" external>
          Learn more
        </Link>
      </div>
    </div>
  )
}

const tokensRouteVariants = cva('flex w-fit items-center gap-1 rounded-full p-0.5', {
  variants: {
    bg: {
      susds: 'bg-[linear-gradient(90deg,rgb(43,79,74,0.2)_0%,rgb(43,79,74)_100%)]',
      susdc: 'bg-[linear-gradient(90deg,rgb(42,78,92,0.2)_0%,rgb(42,78,92)_100%)]',
      sdai: 'bg-[linear-gradient(90deg,rgb(39,81,60,0.2)_0%,rgb(39,81,60)_100%)]',
    },
  },
})
