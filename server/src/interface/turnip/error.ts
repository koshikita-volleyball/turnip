import { type APIGatewayProxyResult } from 'aws-lambda'
import { CORS_HEADERS } from '../../common/const'

interface HttpResponseErrorType extends Error {
  statusCode: number
  response: APIGatewayProxyResult
}

export class HttpResponseError extends Error implements HttpResponseErrorType {
  statusCode: number
  response: APIGatewayProxyResult
  constructor (name: string, statusCode: number, message: string) {
    super(message)
    this.name = name
    this.statusCode = statusCode
    this.response = {
      statusCode,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        error: message
      })
    }
  }
}

export class BadRequestError extends HttpResponseError {
  constructor (message: string) {
    super('BadRequestError', 400, message)
  }
}

export class NotFoundError extends HttpResponseError {
  constructor (message: string) {
    super('NotFoundError', 404, message)
  }
}

export class InternalServerError extends HttpResponseError {
  constructor (message: string) {
    super('InternalServerError', 500, message)
  }
}

export class NotImplementedError extends HttpResponseError {
  constructor (message: string) {
    super('NotImplementedError', 501, message)
  }
}
