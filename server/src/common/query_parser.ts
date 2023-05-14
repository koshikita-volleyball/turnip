import { APIGatewayEvent } from 'aws-lambda'
import { CrossOverIndicator, GrowthRateIndicator, Indicator } from '../interface/jquants/indicator'
import dayjs from '../common/dayjs'
import { getBusinessDays } from '../screener/utils'
import { BadRequestError } from '../interface/turnip/error'

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

type Period = {
  from?: string
  to?: string
}

type PaginationParams = {
  page: number
}

export const check_required = <T>(name: string, value: T | undefined) => {
  if (value === undefined || value === null) {
    throw new BadRequestError(`Missing required parameter: ${name}`)
  }
  return value
}

export const getStockCodedParams = (event: APIGatewayEvent): StockCode => {
  const code = event.queryStringParameters?.code
  return { code }
}

export const getStockCommonFilterParams = (event: APIGatewayEvent): StockCommonFilter => ({
  codes: _parseList(event.queryStringParameters?.codes),
  sector_17_codes: _parseList(event.queryStringParameters?.sector_17_codes),
  sector_33_codes: _parseList(event.queryStringParameters?.sector_33_codes),
  market_codes: _parseList(event.queryStringParameters?.market_codes),
})

export const getDateParams = (event: APIGatewayEvent): Date => ({
  date: event.queryStringParameters?.date,
})

export const getPeriodParams = (event: APIGatewayEvent): Period => ({
  from: event.queryStringParameters?.from,
  to: event.queryStringParameters?.to,
})

export const getPaginationParams = (event: APIGatewayEvent): PaginationParams => ({
  page: parseInt(event.queryStringParameters?.page || '1'),
})

export const getIndicatorParams = async (event: APIGatewayEvent): Promise<Indicator[]> => {
  try {
    const rules = event.queryStringParameters?.rules
    if (!rules) return []
    return Promise.all((JSON.parse(decodeURI(rules)) as Indicator[]).map(_parseIndicator))
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
    up: _default(indicator.up, true),
    before: _default(indicator.before, businessDays[businessDays.length - 2]),
    after: _default(indicator.after, businessDays[businessDays.length - 1]),
    positive: _default(indicator.positive, true),
  }
}

const _parseCrossOverIndicator = (indicator: CrossOverIndicator, now: dayjs.Dayjs) => {
  if (!indicator.from) {
    throw new Error('`from` is required for cross_over indicator')
  }
  return {
    ...indicator,
    line1: _default(indicator.line1, 'close'),
    line2: _default(indicator.line2, 'ma_25'),
    from: indicator.from,
    to: _default(indicator.to, now.format('YYYY-MM-DD')),
    positive: _default(indicator.positive, true),
  }
}

const _default = <T>(val: T | undefined, def: T): T => {
  return val !== undefined ? val : def
}
const _parseList = (str: string | undefined): string[] | undefined => {
  if (!str) return undefined
  return str.split(',')
}
