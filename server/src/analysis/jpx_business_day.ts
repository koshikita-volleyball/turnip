import AWS from 'aws-sdk'
import dayjs, { toDayjs } from '../common/dayjs'
import JQuantsClient from '../common/jquants_client'
import GetProcessEnv from '../common/process_env'
import PricesDailyQuotesStruct from '../interface/jquants/prices_daily_quotes'

const _getBusinessDaysFromJQuants = async (): Promise<dayjs.Dayjs[]> => {
  const code_toyota = '72030'
  const { daily_quotes } = await JQuantsClient<{
    daily_quotes: PricesDailyQuotesStruct[]
  }>('/v1/prices/daily_quotes', { code: code_toyota })
  const dates = daily_quotes.map(dq => toDayjs(dq.Date))
  console.log(`Successfully got business days from JQuants: ${dates.length} days`)
  return dates
}

const _getBusinessDaysFromS3 = async (): Promise<dayjs.Dayjs[]> => {
  const s3 = new AWS.S3()
  const params = {
    Bucket: GetProcessEnv('S3_BUCKET_NAME'),
    Key: 'business_days.json',
  }
  const data = (await s3.getObject(params).promise()).Body?.toString('utf-8')
  if (!data) {
    throw new Error('Failed to get business days from S3')
  }
  const dates = (JSON.parse(data) as string[]).map(d => toDayjs(d))
  console.log(`Successfully got business days from S3: ${dates.length} days`)
  return dates
}

const _saveBusinessDaysToS3 = async (dates: dayjs.Dayjs[]): Promise<void> => {
  const s3 = new AWS.S3()
  const params = {
    Bucket: GetProcessEnv('S3_BUCKET_NAME'),
    Key: 'business_days.json',
    Body: JSON.stringify(dates.map(d => d.format('YYYY-MM-DD'))),
  }
  await s3.putObject(params).promise()
  console.log(`Successfully saved business days to S3: ${dates.length} days`)
}

export const getBusinessDays = async (
  from?: dayjs.Dayjs,
  to?: dayjs.Dayjs,
  source: 's3' | 'jquants' = 's3',
): Promise<dayjs.Dayjs[]> => {
  const dates =
    source === 's3' ? await _getBusinessDaysFromS3() : await _getBusinessDaysFromJQuants()
  return dates
    .filter(d => {
      if (from && d.isBefore(from, 'day')) return false
      if (to && d.isAfter(to, 'day')) return false
      return true
    })
    .sort((a, b) => a.diff(b, 'day'))
}

export const updateBusinessDays = async (): Promise<void> => {
  const dates = await _getBusinessDaysFromJQuants()
  await _saveBusinessDaysToS3(dates)
}

export const isBusinessDay = async (date: dayjs.Dayjs): Promise<boolean> => {
  const dates = await getBusinessDays()
  return dates.some(d => d.isSame(date, 'day'))
}
