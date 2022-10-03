import { $, useContext, useStore } from '@builder.io/qwik'
import { request, RequestDocument } from 'graphql-request'
import { QwikqlRequestContextContext, QwikqlURLContext } from './contexts'
import { toQwikqlError } from './util/toQwikqlError'

interface MutationStore {
  data: any
  loading: boolean
  error: { message: string } | null
}

export const useMutation = (mutation: RequestDocument) => {
  const url = useContext(QwikqlURLContext).url
  const requestContext = useContext(QwikqlRequestContextContext)
  const mutationAsString = mutation?.toString()
  const result = useStore<MutationStore>({
    data: undefined,
    loading: false,
    error: null
  })

  const mutate$ = $(async (variables: Record<string, any>) => {
    result.loading = true
    try {
      result.data = await request({
        url,
        document: mutationAsString,
        variables,
        requestHeaders: requestContext.headers
      })
    } catch (error) {
      result.error = toQwikqlError(error)
    }
    result.loading = false
  })

  return { mutate$, result }
}
