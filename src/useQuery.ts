import { useContext, $ } from '@builder.io/qwik'
import { rawRequest, RequestDocument } from 'graphql-request'
import { QwikqlRequestContextContext, QwikqlURLContext } from './contexts'
import { toQwikqlError } from './util/toQwikqlError'

interface QueryConfig {
  variables?: Record<string, any>
}

export const defaultAfter$ = $(() => {});

export const useQuery = (query: RequestDocument) => {
  const queryAsString = query.toString()
  const { url, after$ = defaultAfter$ } = useContext(QwikqlURLContext)
  const requestContext = useContext(QwikqlRequestContextContext)

  const executeQuery$ = $(async (queryConfig: Partial<QueryConfig> = {}) => {
    try {
      const response = await rawRequest(
        url,
        queryAsString,
        queryConfig.variables || undefined,
        requestContext.headers
      );

      after$(response);

      return response.data;
    } catch (error) {
      return Promise.reject(toQwikqlError(error))
    }
  })

  return { executeQuery$ }
}
