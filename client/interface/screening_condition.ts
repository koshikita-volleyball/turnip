type ScreeningConditionType =
  | 'growth_rate'
  | 'cross_over'

type OHCL =
  | 'open'
  | 'high'
  | 'close'
  | 'low'

type MovingAverageType =
  | 'close'
  | 'ma_25'
  | 'ma_50'

// 基底クラス
type ScreeningConditionStruct = {
  type: ScreeningConditionType
  positive: boolean
}

type ScreeningConditionGrowthRateStruct = ScreeningConditionStruct & {
  threshold: number
  up: boolean
  ohlc: OHCL
  before: string
  after: string
}

type ScreeningConditionCrossOverStruct = ScreeningConditionStruct & {
  line1: MovingAverageType
  line2: MovingAverageType
  from: string
  to: string
}

type ScreeningConditionStructs = ScreeningConditionGrowthRateStruct | ScreeningConditionCrossOverStruct

export type { ScreeningConditionStructs, ScreeningConditionGrowthRateStruct, ScreeningConditionCrossOverStruct, OHCL, MovingAverageType }
