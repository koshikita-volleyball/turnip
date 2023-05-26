export type TimeSeriesLineType = 'ma_25' | 'ma_50' | 'close'

export interface TimeSeriesPoint {
  date: string
  value: number | boolean | null
}
