import { Indicator } from '../interface/jquants/indicator'
import { Stock } from '../interface/turnip/stock'
import growthRate from './growth_rate'
import crossOver from './cross_over'

const screener = async (stocks: Stock[], indicators: Indicator[]): Promise<Stock[]> => {
  const results = await Promise.all(stocks.map(stock => _checkIndicators(stock, indicators)))
  return stocks.filter((_, i) => results[i])
}

const _checkIndicators = async (stock: Stock, indicators: Indicator[]): Promise<boolean> => {
  const results = await Promise.all(indicators.map(indicator => _checkIndicator(stock, indicator)))
  return results.every(result => result)
}

const _checkIndicator = async (stock: Stock, indicator: Indicator): Promise<boolean> => {
  if (indicator.type === 'growth_rate') {
    return toggle(!indicator.positive, growthRate(stock, indicator))
  } else if (indicator.type === 'cross_over') {
    return toggle(!indicator.positive, crossOver(stock, indicator))
  }
  throw new Error('not implemented')
}

const toggle = async (isToggle: boolean, val: Promise<boolean>): Promise<boolean> => {
  const v = await val
  return isToggle ? !v : v
}

export default screener
