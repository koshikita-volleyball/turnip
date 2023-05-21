import { type APIGatewayEvent, type APIGatewayProxyResult } from 'aws-lambda'
import { CORS_HEADERS } from './const'
import { HttpResponseError, InternalServerError } from '../interface/turnip/error'

type Fn = (event: APIGatewayEvent) => string
type AsyncFn = (event: APIGatewayEvent) => Promise<string>
export type APIFn = Fn | AsyncFn

export const api = async (
  fn: Fn | AsyncFn,
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const body = await fn(event)
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body
    }
  } catch (err: unknown) {
    if (err instanceof HttpResponseError) {
      return err.response
    }
    const message = err instanceof Error ? err.message : JSON.stringify(err)
    console.error(message)
    return new InternalServerError(message).response
  }
}
