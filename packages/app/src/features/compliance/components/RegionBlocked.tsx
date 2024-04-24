import { Banner } from './Banner'

export interface RegionBlockedProps {
  countryCode: string
}
export function RegionBlocked({ countryCode }: RegionBlockedProps) {
  return (
    <Banner>
      <Banner.Content>
        <Banner.Header> Region blocked </Banner.Header>
        <Banner.Description>
          We're sorry but you're connecting from a blocked region ({countryCode} country code).
        </Banner.Description>
      </Banner.Content>
    </Banner>
  )
}
