import { APIGatewayEvent } from 'aws-lambda'
import { CrossOverIndicator, GrowthRateIndicator, Indicator } from '../interface/jquants/indicator'
import dayjs from '../common/dayjs'
import { getBusinessDays } from '../analysis/jpx_business_day'
import { BadRequestError } from '../interface/turnip/error'

type Required<T extends object> = boolean | (keyof T)[]

type StockCode = {
  code: string
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

export const getStockCodedParams = (event: APIGatewayEvent): StockCode => {
  const code = event.queryStringParameters?.code
  if (!code) {
    // throw new Error('Missing required parameter: code')
    throw new BadRequestError('Missing required parameter: code')
  }
  return { code }
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

export const getIndicatorParams = async (event: APIGatewayEvent): Promise<Indicator[]> => {
  try {
    const conditions = event.queryStringParameters?.conditions
    if (!conditions) return []
    return Promise.all((JSON.parse(decodeURI(conditions)) as Indicator[]).map(_parseIndicator))
  } catch (e) {
    console.error(e)
  }
  return []
}

const _parseIndicator = async (indicator: Indicator): Promise<Indicator> => {
  const businessDays = await getBusinessDays()
  const now = dayjs()
  if (indicator.type === 'growth_rate') {
    return _parseGrowthRateIndicator(indicator, businessDays)
  } else if (indicator.type === 'cross_over') {
    return _parseCrossOverIndicator(indicator, now)
  }
  throw new Error('Unknown indicator type')
}

const _parseGrowthRateIndicator = (
  indicator: GrowthRateIndicator,
  businessDays: string[],
): GrowthRateIndicator => {
  if (!indicator.threshold) {
    throw new Error('`threshold` is required for growth_rate indicator')
  }
  return {
    ...indicator,
    threshold: indicator.threshold,
    up: indicator.up || true,
    before: indicator.before || businessDays[businessDays.length - 2],
    after: indicator.after || businessDays[businessDays.length - 1],
    positive: indicator.positive || true,
  }
}

const _parseCrossOverIndicator = (indicator: CrossOverIndicator, now: dayjs.Dayjs) => {
  if (!indicator.from) {
    throw new Error('`from` is required for cross_over indicator')
  }
  return {
    ...indicator,
    line1: indicator.line1 || 'close',
    line2: indicator.line2 || 'ma_25',
    from: indicator.from,
    to: indicator.to || now.format('YYYY-MM-DD'),
    positive: indicator.positive || true,
  }
}
