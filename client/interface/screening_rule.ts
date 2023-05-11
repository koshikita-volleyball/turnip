type ScreeningRuleType = 'growth_rate' | 'cross_over'

type OHLC = 'open' | 'high' | 'low' | 'close'

type MovingAverageType = 'close' | 'ma_25' | 'ma_50'

// 基底クラス
type ScreeningRuleStruct = {
  type: ScreeningRuleType
  positive: boolean
  collapsed: boolean
}

type ScreeningRuleGrowthRateStruct = ScreeningRuleStruct & {
  threshold: number
  up: boolean
  ohlc: OHLC
  before: string
  after: string
}

type ScreeningRuleCrossOverStruct = ScreeningRuleStruct & {
  line1: MovingAverageType
  line2: MovingAverageType
  from: string
  to: string
}

type ScreeningRuleStructs =
  | ScreeningRuleGrowthRateStruct
  | ScreeningRuleCrossOverStruct

export type {
  ScreeningRuleStructs as ScreeningRuleStructs,
  ScreeningRuleGrowthRateStruct as ScreeningRuleGrowthRateStruct,
  ScreeningRuleCrossOverStruct as ScreeningRuleCrossOverStruct,
  OHLC,
  MovingAverageType,
}
