import { type OHLC } from '../interface/jquants/indicator'
import { type TimeSeriesLineType, type TimeSeriesPoint } from '../interface/jquants/line'
import type PricesDailyQuotesStruct from '../interface/jquants/prices_daily_quotes'
import { getDailyQuotes } from '../model/daily_quotes'
import { getBusinessDaysFromS3 } from '../model/jpx_business_day'

// 営業日
export const getBusinessDays = getBusinessDaysFromS3
export const isBusinessDay = async (date: string): Promise<boolean> => {
  const dates = await getBusinessDays()
  return dates.some(d => d === date)
}

// 銘柄毎の時系列グラフ
export const getStockTimeSeries = async (
  code: string,
  type: TimeSeriesLineType
): Promise<TimeSeriesPoint[]> => {
  const data = await getDailyQuotes({ code })
  const closes = data.map(d => ({ date: d.Date, value: d.Close }))
  const window = type === 'ma_25' ? 25 : type === 'ma_50' ? 50 : 0
  return movingAverage(closes, window)
}

// 移動平均
const movingAverage = (data: TimeSeriesPoint[], window: number): TimeSeriesPoint[] => {
  const ma = data.map((d, i) => {
    if (i < window - 1) {
      return { date: d.date, value: null }
    }
    const sum = data.slice(i - window + 1, i + 1).reduce((acc, cur) => acc + Number(cur.value), 0)
    return { date: d.date, value: sum / window }
  })
  return ma
}

export const getOHLC = (price: PricesDailyQuotesStruct, ohlc: OHLC): number => {
  switch (ohlc) {
    case 'open':
      return price.Open
    case 'high':
      return price.High
    case 'low':
      return price.Low
    case 'close':
      return price.Close
    default:
      throw new Error('invalid OHLC')
  }
}
