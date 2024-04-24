import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { ReactNode } from 'react'

// @todo: any better idea to import locales? TypeScript doesn't like this
// @ts-ignore
import { messages } from '../../locales/en.po'

i18n.load('en', messages)
i18n.activate('en')

export function I18nTestProvider({ children }: { children: ReactNode }) {
  return <I18nProvider i18n={i18n}>{children}</I18nProvider>
}
