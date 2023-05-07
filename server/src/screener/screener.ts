import { Indicator } from '../interface/jquants/indicator'
import { Stock } from '../interface/turnip/stock'
import growthRate from './growth_rate'
import crossOver from './cross_over'

const screener = (stocks: Stock[], indicators: Indicator[]): Stock[] => {
  return stocks.filter(stock => {
    return indicators.every(indicator => {
      return _toggle(!indicator.positive, _check(stock, indicator))
    })
  })
}

const _check = (stock: Stock, indicator: Indicator): boolean => {
  if (indicator.type === 'growth_rate') {
    return growthRate(stock, indicator)
  } else if (indicator.type === 'cross_over') {
    return crossOver(stock, indicator)
  }
  throw new Error('not implemented')
}

const _toggle = (isToggle: boolean, val: boolean): boolean => {
  return isToggle ? !val : val
}

export default screener
