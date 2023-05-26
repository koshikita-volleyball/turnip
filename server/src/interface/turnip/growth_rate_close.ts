import { type DiffPricesDailyQuotesStruct } from './utils'

interface GrowthRateClose {
  code: string
  growth_rate: number
  daily_quotes: DiffPricesDailyQuotesStruct
}
export default GrowthRateClose
