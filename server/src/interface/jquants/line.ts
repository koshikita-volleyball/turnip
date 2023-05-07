export type TimeSeriesLineType = 'ma_25' | 'ma_50' | 'close'

export type TimeSeriesPoint = {
  date: string
  value: number | boolean | null
}
