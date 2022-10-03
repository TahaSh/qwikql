import { useContext } from '@builder.io/qwik'
import { QwikqlSetHeadersContext } from './contexts'

export const useHeaders = () => useContext(QwikqlSetHeadersContext)
