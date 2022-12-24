import { createContext, QRL } from '@builder.io/qwik'

export const QwikqlURLContext = createContext<{ url: string, after$?: QRL<(args: any) => void> }>('qwikql.url')
export const QwikqlRequestContextContext = createContext<{
  headers: Record<string, string>
}>('qwikql.requestContext')
export const QwikqlSetHeadersContext =
  createContext<QRL<(headers: Record<string, string>) => void>>(
    'qwikql.setHeaders'
  )
