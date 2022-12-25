import {
  $,
  component$,
  QRL,
  Slot,
  useContextProvider,
  useStore
} from '@builder.io/qwik'
import {
  QwikqlRequestContextContext,
  QwikqlSetHeadersContext,
  QwikqlURLContext
} from './contexts'
import { Response } from './types';

interface QwikQLProps {
  url: string
  headers?: Record<string, string>
  after$?: QRL<((resp: Response) => {})>
}

export const defaultAfter = $(() => {});

export const QwikQL = component$((props: QwikQLProps) => {
  if (!props.url) {
    throw new Error('url prop is missing in QwikQL')
  }

  const context = useStore({ headers: props.headers || {} })

  useContextProvider(QwikqlURLContext, { url: props.url, after$: props.after$ || defaultAfter })
  useContextProvider(QwikqlRequestContextContext, context)
  useContextProvider(
    QwikqlSetHeadersContext,
    $((headers) => {
      context.headers = headers
    })
  )
  return <Slot />
})
