import { APIGatewayProxyResult } from 'aws-lambda'
import { CORS_HEADERS } from '../../common/const'

interface HttpResponseErrorType extends Error {
  statusCode: number
  response: APIGatewayProxyResult
}

class HttpResponseError extends Error implements HttpResponseErrorType {
  statusCode: number
  response: APIGatewayProxyResult
  constructor(statusCode: number, message: string) {
    super(message)
    this.statusCode = statusCode
    this.response = {
      statusCode,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        error: message,
      }),
    }
  }
}

export class BadRequestError extends HttpResponseError {
  constructor(message: string) {
    super(400, message)
  }
}

export class InternalServerError extends HttpResponseError {
  constructor(message: string) {
    super(500, message)
  }
}

export class NotImplementedError extends HttpResponseError {
  constructor(message: string) {
    super(501, message)
  }
}
