import { Banner } from './Banner'

export interface PageNotAvailableProps {
  countryCode: string
}
export function PageNotAvailable({ countryCode }: PageNotAvailableProps) {
  return (
    <Banner>
      <Banner.Content>
        <Banner.Header> Page not available in your region </Banner.Header>
        <Banner.Description>
          We're sorry but the page is not available in a region you're connecting from ({countryCode} country code).
        </Banner.Description>
      </Banner.Content>
    </Banner>
  )
}
