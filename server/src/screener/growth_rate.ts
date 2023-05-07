import { Checker } from './screener'
import { getOHLC } from './utils'

const growthRate: Checker = ({ indicator, prices }): boolean => {
  if (indicator.type !== 'growth_rate') {
    throw new Error('invalid indicator type')
  }
  const beforePrice = prices.find(d => d.Date === indicator.before)
  const afterPrice = prices.find(d => d.Date === indicator.after)
  if (!beforePrice || !afterPrice) {
    return false
  }
  const beforeVal = getOHLC(beforePrice, 'close') // FIXME:
  const afterVal = getOHLC(afterPrice, 'close') // FIXME:
  if (isNaN(beforeVal) || isNaN(afterVal)) {
    return false
  }
  const diff = afterVal - beforeVal
  const th = indicator.threshold * beforeVal
  return indicator.up ? diff > th : diff < th
}

export default growthRate
