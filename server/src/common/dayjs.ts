import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/Tokyo')

export const toDayjs = (date: Date | string | number | dayjs.Dayjs): dayjs.Dayjs => {
  return dayjs.tz(date)
}

export const getDefaultPeriod = (): { from: string; to: string } => {
  const from = dayjs().subtract(2, 'year').format('YYYY-MM-DD')
  const to = dayjs().format('YYYY-MM-DD')
  return { from, to }
}

export default dayjs
