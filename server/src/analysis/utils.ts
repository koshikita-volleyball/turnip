import dayjs from '../common/dayjs'
import JQuantsClient from '../common/jquants_client'
import PricesDailyQuotesStruct from '../interface/jquants/prices_daily_quotes'

export const getBusinessDays = async (
  from?: dayjs.Dayjs,
  to?: dayjs.Dayjs,
): Promise<dayjs.Dayjs[]> => {
  const code_toyota = '72030'
  const { daily_quotes } = await JQuantsClient<{
    daily_quotes: PricesDailyQuotesStruct[]
  }>('/v1/prices/daily_quotes', { code: code_toyota })
  const dates = daily_quotes
    .map(dq => dayjs.tz(dq.Date))
    .filter(d => {
      if (from && d.isBefore(from, 'day')) return false
      if (to && d.isAfter(to, 'day')) return false
      return true
    })
    .sort((a, b) => a.diff(b, 'day'))
  return dates
}

export const isBusinessDay = async (date: dayjs.Dayjs): Promise<boolean> => {
  const business_days = await getBusinessDays()
  return business_days.some(d => d.isSame(date, 'day'))
}
