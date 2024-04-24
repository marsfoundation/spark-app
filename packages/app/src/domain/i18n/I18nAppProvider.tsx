import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { ReactNode, useEffect } from 'react'
import toast from 'react-hot-toast'

import { defaultLocale, switchLocale } from './locales'

export function I18nAppProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    switchLocale(defaultLocale).catch((error) => {
      toast.error('Failed to load locale', error)
    })
  }, [])

  return <I18nProvider i18n={i18n}>{children}</I18nProvider>
}
