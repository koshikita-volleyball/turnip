import { GrowthRateIndicator } from '../interface/jquants/indicator'
import { Stock } from '../interface/turnip/stock'
import { getDailyQuotes } from '../model/daily_quotes'
import { getOHLC } from './utils'

const growthRate = async (stock: Stock, params: GrowthRateIndicator): Promise<boolean> => {
  const prices = await getDailyQuotes({ code: stock.Code })
  const beforePrice = prices.find(d => d.Date === params.before)
  const afterPrice = prices.find(d => d.Date === params.after)
  if (!beforePrice || !afterPrice) {
    return false
  }
  const beforeVal = getOHLC(beforePrice, 'close') // FIXME: 
  const afterVal = getOHLC(afterPrice, 'close') // FIXME: 
  if (isNaN(beforeVal) || isNaN(afterVal)) {
    return false
  }
  const diff = afterVal - beforeVal
  const th = params.threshold * beforeVal
  return params.up ? diff > th : diff < th
}

export default growthRate
