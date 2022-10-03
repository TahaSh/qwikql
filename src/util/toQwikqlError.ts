import { QwikqlError } from '../types'

export function toQwikqlError(error: unknown): QwikqlError {
  if (error instanceof Error) {
    let message = error.message
    const regExp = /\{\s*"message"/gi
    if (regExp.test(message)) {
      const matches = message.match(/"message"[^"]*?"(.*?)"/)
      message = matches?.[1] || message
    }
    return {
      message
    }
  }
  if (typeof error === 'string') {
    return {
      message: error
    }
  }
  return {
    message: 'error'
  }
}
