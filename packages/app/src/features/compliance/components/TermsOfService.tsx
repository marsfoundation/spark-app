import React, { useState } from 'react'

import { MultiPanelDialog } from '@/features/dialogs/common/components/MultiPanelDialog'
import { assets } from '@/ui/assets'
import { Button } from '@/ui/atoms/button/Button'
import { Link } from '@/ui/atoms/link/Link'
import { ScrollArea } from '@/ui/atoms/scroll-area/ScrollArea'
import { Tooltip, TooltipContentShort } from '@/ui/atoms/tooltip/Tooltip'
import { TooltipTrigger } from '@/ui/atoms/tooltip/Tooltip'
import { links } from '@/ui/constants/links'
import { cn } from '@/ui/utils/style'
import { useIsIntersecting } from '@/ui/utils/useIntersecting'

interface ToSLinkProps {
  className?: string
}
function ToSLink({ className }: ToSLinkProps) {
  return (
    <Link to={links.termsOfUse} className={cn('underline', className)} external>
      Terms of Service
    </Link>
  )
}

const points = [
  // biome-ignore lint/correctness/useJsxKeyInIterable: <explanation>
  <p>
    I am not the person or entities who reside in, are citizens of, are incorporated in, or have a registered office in
    the United States of America or any Prohibited Localities, as defined in the <ToSLink />. I will not in the future
    access this site while located within the United States or any Prohibited Localities, as defined in the <ToSLink />.
    I am not using, and will not in the future use, a VPN to mask my physical location from a restricted territory. I am
    lawfully permitted to access this site and use its services under the laws of the jurisdiction in which I reside and
    am located.
  </p>,
  // biome-ignore lint/correctness/useJsxKeyInIterable: <explanation>
  <p>
    The Site displays information publicly available on blockchain systems related to third party protocols, including
    Spark, and may offer interaction methods for use with a third-party wallet application or device based on such
    information, but the Site Operator cannot guarantee the accuracy of such information or that interactions will have
    the intended outcome. For example, displayed asset values reflect on-chain data provided by certain third party
    protocols according to such protocol's mechanics and governance procedures, including Sky (previously MakerDAO), and
    such protocol's are outside the Site's control and are subject to change. Furthermore, such protocols may be
    adversely affected by malfunctions, bugs, defects, hacking, theft, attacks, negligent coding or design choices, or
    changes to the applicable protocol rules, which may expose you to a risk of total loss and forfeiture of all
    relevant digital assets. Site Operator assumes no liability or responsibility for any of the foregoing matters,
    including asset value pricing, and you are responsible for understanding the risks of the third party protocols you
    interact with and keeping up to date with protocol or governance changes for such protocols.
  </p>,
  // biome-ignore lint/correctness/useJsxKeyInIterable: <explanation>
  <p>
    Your use of the Site is conditioned on your acknowledgement and understanding of the potential risks and regulatory
    issues as further described in the <ToSLink />, and you agree to hold the Site Operator harmless from such risks.
    All functions interacting with third party protocols on the Site are autonomous and if something goes wrong with the
    smart contracts, there is no recourse against a private individual or legal entity. Similarly, while the Site
    provides information regarding such protocols, the Site Operator is not responsible for issues with the protocols.
    The Site Operator cannot access or control deposits or transactions initiated through the Site. The Site Operator
    has no control over Spark, Sky (previously MakerDAO) or other third party protocols or other frontends. Site
    Operator does not and will not enter into any legal or factual relationship with any user of such protocols beyond
    provision and maintenance of the Site.
  </p>,
]

export interface TermsOfServiceProps {
  onAgree?: () => void
}

export function TermsOfService({ onAgree }: TermsOfServiceProps) {
  const [hasUserReadTerms, setHasUserReadTerms] = useState(false)

  const { scrollAreaRef, sentinelRef } = useIsIntersecting({
    onIntersect: (isVisible) => {
      if (isVisible) {
        setHasUserReadTerms(true)
      }
    },
  })

  return (
    <MultiPanelDialog>
      <div className="font-semibold text-xl">Terms of Service and Disclaimer</div>
      <div>
        By using this site, I represent that I have read and agree to the <ToSLink className="text-blue-600" /> and{' '}
        <Link to={links.privacyPolicy} className="underline" external>
          Privacy Policy
        </Link>
        . Undefined terms used below are in reference to definitions in the Terms of Service.
      </div>
      <ScrollArea
        viewportRef={scrollAreaRef}
        className="h-64 rounded-md border border-light-grey pr-3 pl-2"
        type="always"
      >
        <div className="grid grid-cols-[auto_1fr] gap-4">
          {points.map((point, index) => (
            <React.Fragment key={index}>
              <img src={assets.success} alt="success-img" className="h-4 w-4 translate-y-1" />
              {point}
            </React.Fragment>
          ))}
        </div>
        <div ref={sentinelRef} className="h-[5px]" />
      </ScrollArea>

      {hasUserReadTerms ? (
        <Button className="mt-2 w-full" size="lg" onClick={onAgree}>
          Agree and Continue
        </Button>
      ) : (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button disabled className="mt-2 w-full disabled:pointer-events-auto" size="lg" onClick={onAgree}>
              Agree and Continue
            </Button>
          </TooltipTrigger>
          <TooltipContentShort>Read terms before accepting</TooltipContentShort>
        </Tooltip>
      )}
    </MultiPanelDialog>
  )
}
