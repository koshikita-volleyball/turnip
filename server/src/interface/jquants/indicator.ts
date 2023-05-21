import { type LineType } from './line'

type IndicatorType = 'growth_rate' | 'cross_over'
type OHLC = 'open' | 'high' | 'low' | 'close'

interface CommonIndicator {
  type: IndicatorType
  positive: boolean
}

export type GrowthRateIndicator = CommonIndicator & {
  type: 'growth_rate'
  threshold: number
  up?: boolean
  ohlc: OHLC
  before: string
  after: string
}

export type CrossOverIndicator = CommonIndicator & {
  type: 'cross_over'
  line1: LineType
  line2: LineType
  from: string
  to: string
}

export type Indicator = GrowthRateIndicator | CrossOverIndicator
