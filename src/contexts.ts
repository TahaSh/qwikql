import { createContextId, QRL } from '@builder.io/qwik'

export const QwikqlURLContext = createContextId<{ url: string }>('qwikql.url')
export const QwikqlTimeoutContext = createContextId<{ timeout: number }>(
  'qwikql.timeout'
)
export const QwikqlRequestContextContext = createContextId<{
  headers: Record<string, string>
}>('qwikql.requestContext')
export const QwikqlSetHeadersContext =
  createContextId<QRL<(headers: Record<string, string>) => void>>(
    'qwikql.setHeaders'
  )
