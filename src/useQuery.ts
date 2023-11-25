import { useContext, $ } from '@builder.io/qwik'
import { request, RequestDocument } from 'graphql-request'
import {
  QwikqlRequestContextContext,
  QwikqlTimeoutContext,
  QwikqlURLContext
} from './contexts'
import { toQwikqlError } from './util/toQwikqlError'

interface QueryConfig {
  variables?: Record<string, any>
}

export const useQuery = (query: RequestDocument) => {
  const queryAsString = query.toString()
  const url = useContext(QwikqlURLContext).url
  const requestContext = useContext(QwikqlRequestContextContext)
  const timeout = useContext(QwikqlTimeoutContext).timeout

  const executeQuery$ = $(async (queryConfig: Partial<QueryConfig> = {}) => {
    let controller: AbortController | undefined, timeoutId
    if (timeout) {
      controller = new AbortController()
      timeoutId = setTimeout(() => {
        controller!.abort()
      }, timeout)
    }

    try {
      return await request({
        url,
        document: queryAsString,
        variables: queryConfig.variables || undefined,
        requestHeaders: requestContext.headers,
        signal: controller?.signal
      })
    } catch (error) {
      return Promise.reject(toQwikqlError(error))
    } finally {
      if (timeoutId) clearTimeout(timeoutId)
    }
  })

  return { executeQuery$ }
}
