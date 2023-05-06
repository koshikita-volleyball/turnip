import { APIGatewayEvent } from 'aws-lambda'

type Required<T extends object> = boolean | (keyof T)[]

type StockCode = {
  code?: string
}

type StockCommonFilter = {
  codes?: string[]
  sector_17_codes?: string[]
  sector_33_codes?: string[]
  market_codes?: string[]
}

type Date = {
  date?: string
}

type DatePeriod = {
  from?: string
  to?: string
}

type PaginationParams = {
  page: number
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

const _parseList = (str: string | undefined): string[] | undefined => {
  if (!str) return undefined
  return str.split(',')
}

export const getStockCodedParams = (
  event: APIGatewayEvent,
  required: Required<StockCode> = false,
): StockCode => {
  return _check_required<StockCode>(
    {
      code: event.queryStringParameters?.code,
    },
    required,
  )
}

export const getStockCommonFilterParams = (
  event: APIGatewayEvent,
  required: Required<StockCommonFilter> = false,
): StockCommonFilter => {
  return _check_required<StockCommonFilter>(
    {
      codes: _parseList(event.queryStringParameters?.codes),
      sector_17_codes: _parseList(event.queryStringParameters?.sector_17_codes),
      sector_33_codes: _parseList(event.queryStringParameters?.sector_33_codes),
      market_codes: _parseList(event.queryStringParameters?.market_codes),
    },
    required,
  )
}

export const getDateParams = (event: APIGatewayEvent, required: Required<Date> = false): Date => {
  return _check_required<Date>(
    {
      date: event.queryStringParameters?.date,
    },
    required,
  )
}

export const getDatePeriodParams = (
  event: APIGatewayEvent,
  required: Required<DatePeriod> = false,
): DatePeriod => {
  return _check_required<DatePeriod>(
    {
      from: event.queryStringParameters?.from,
      to: event.queryStringParameters?.to,
    },
    required,
  )
}

export const getPaginationParams = (event: APIGatewayEvent): PaginationParams => ({
  page: parseInt(event.queryStringParameters?.page || '1'),
})
