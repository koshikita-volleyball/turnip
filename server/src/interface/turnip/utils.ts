import type PricesDailyQuotesStruct from '../jquants/prices_daily_quotes'

export interface DiffPricesDailyQuotesStruct {
  before: PricesDailyQuotesStruct
  after: PricesDailyQuotesStruct
}
