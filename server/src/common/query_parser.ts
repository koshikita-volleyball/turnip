import { APIGatewayEvent } from 'aws-lambda'

type Required<T extends object> = boolean | (keyof T)[]

type StockParams = {
  code?: string
  company_name?: string
  sector_17_code?: string
  sector_33_code?: string
  market_code?: string
}

type DateParams = {
  date?: string
}

type DatePeriodParams = {
  from?: string
  to?: string
}

const _check_required = <T extends object>(params: T, required: Required<T>): T => {
  if (typeof required === 'boolean' && !required) return params

  const keys = (typeof required === 'boolean' ? Object.keys(params) : required) as (keyof T)[]
  keys.forEach(require => {
    if (!params[require]) {
      throw new Error(`Missing required parameter: ${String(require)}`)
    }
  })

  return params
}

export const getDateParams = (
  event: APIGatewayEvent,
  required: Required<DateParams> = false,
): DateParams => {
  return _check_required<DateParams>(
    {
      date: event.queryStringParameters?.date,
    },
    required,
  )
}

export const getDatePeriodParams = (
  event: APIGatewayEvent,
  required: Required<DatePeriodParams> = false,
): DatePeriodParams => {
  return _check_required<DatePeriodParams>(
    {
      from: event.queryStringParameters?.from,
      to: event.queryStringParameters?.to,
    },
    required,
  )
}

export const getStockParams = (
  event: APIGatewayEvent,
  required: Required<StockParams> = false,
): StockParams => {
  return _check_required<StockParams>(
    {
      code: event.queryStringParameters?.code,
      company_name: event.queryStringParameters?.company_name,
      sector_17_code: event.queryStringParameters?.sector_17_code,
      sector_33_code: event.queryStringParameters?.sector_33_code,
      market_code: event.queryStringParameters?.market_code,
    },
    required,
  )
}
