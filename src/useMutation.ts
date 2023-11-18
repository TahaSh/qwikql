import { $, useContext, useStore } from '@builder.io/qwik'
import { request, RequestDocument } from 'graphql-request'
import {
  QwikqlRequestContextContext,
  QwikqlTimeoutContext,
  QwikqlURLContext
} from './contexts'
import { toQwikqlError } from './util/toQwikqlError'

interface MutationStore {
  data: any
  loading: boolean
  error: { message: string } | null
}

export const useMutation = (mutation: RequestDocument) => {
  const url = useContext(QwikqlURLContext).url
  const requestContext = useContext(QwikqlRequestContextContext)
  const timeout = useContext(QwikqlTimeoutContext).timeout

  const mutationAsString = mutation?.toString()
  const result = useStore<MutationStore>({
    data: undefined,
    loading: false,
    error: null
  })

  const mutate$ = $(async (variables: Record<string, any>) => {
    result.loading = true
    let controller: AbortController | undefined, timeoutId
    if (timeout) {
      controller = new AbortController()
      timeoutId = setTimeout(() => {
        controller!.abort()
      }, timeout)
    }

    try {
      result.data = await request({
        url,
        document: mutationAsString,
        variables,
        requestHeaders: requestContext.headers,
        signal: controller?.signal
      })
    } catch (error) {
      result.error = toQwikqlError(error)
    } finally {
      if (timeoutId) clearTimeout(timeoutId)
      result.loading = false
    }
  })

  return { mutate$, result }
}
