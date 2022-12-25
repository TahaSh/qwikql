import { rawRequest } from "graphql-request"

export interface QwikqlError {
  message: string
}

export type Response = Awaited<ReturnType<typeof rawRequest>>;
