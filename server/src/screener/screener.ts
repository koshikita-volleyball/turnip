import { type Indicator } from '../interface/jquants/indicator'
import { type Stock } from '../interface/turnip/stock'
import growthRate from './growth_rate'
import crossOver from './cross_over'
import type PricesDailyQuotesStruct from '../interface/jquants/prices_daily_quotes'
import { getDailyQuotes } from '../model/daily_quotes'

interface CheckerProps {
  indicator: Indicator
  stock: Stock
  prices: PricesDailyQuotesStruct[]
}

export type Checker = (props: CheckerProps) => boolean

const screener = async (stocks: Stock[], indicators: Indicator[]): Promise<Stock[]> => {
  const results = await Promise.all(stocks.map(async stock => await _checkIndicators(stock, indicators)))
  return stocks.filter((_, i) => results[i])
}

const _checkIndicators = async (stock: Stock, indicators: Indicator[]): Promise<boolean> => {
  const prices = await getDailyQuotes({ code: stock.Code })
  const results = indicators.map(indicator => _checkIndicator({ stock, indicator, prices }))
  return results.every(result => result)
}

const _checkIndicator = (props: CheckerProps): boolean => {
  const { indicator } = props
  if (indicator.type === 'growth_rate') {
    return toggle(!indicator.positive, growthRate(props))
  } else if (indicator.type === 'cross_over') {
    return toggle(!indicator.positive, crossOver(props))
  }
  throw new Error('not implemented')
}

const toggle = (isToggle: boolean, val: boolean): boolean => {
  return isToggle ? !val : val
}

export default screener
