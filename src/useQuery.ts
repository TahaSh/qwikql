import { useContext, $ } from '@builder.io/qwik'
import { request, RequestDocument } from 'graphql-request'
import { QwikqlRequestContextContext, QwikqlURLContext } from './contexts'
import { toQwikqlError } from './util/toQwikqlError'

interface QueryConfig {
  variables?: Record<string, any>
}

export const useQuery = (query: RequestDocument) => {
  const queryAsString = query.toString()
  const url = useContext(QwikqlURLContext).url
  const requestContext = useContext(QwikqlRequestContextContext)

  const executeQuery$ = $(async (queryConfig: Partial<QueryConfig> = {}) => {
    try {
      return await request({
        url,
        document: queryAsString,
        variables: queryConfig.variables || undefined,
        requestHeaders: requestContext.headers
      })
    } catch (error) {
      return Promise.reject(toQwikqlError(error))
    }
  })

  return { executeQuery$ }
}
