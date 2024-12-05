export interface Chain {
  logo: string
  name: string
  supportedPages: string[]
  selected: boolean
  isInSwitchingProcess: boolean
  onSelect: () => void
}
