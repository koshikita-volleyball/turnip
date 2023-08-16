import JQuantsClient from '../common/jquants_client'
import getProcessEnv from '../common/process_env'
import type PricesDailyQuotesStruct from '../interface/jquants/prices_daily_quotes'
import { GetObjectCommand, PutObjectCommand, s3Client } from '../common/s3_client'

const _filterAndSort = (dates: string[], from?: string, to?: string): string[] =>
  dates
    .filter(d => {
      if (from !== undefined && d < from) return false
      if (to !== undefined && d > to) return false
      return true
    })
    .sort((a, b) => a.localeCompare(b))

export const getBusinessDaysFromJQuants = async (from?: string, to?: string): Promise<string[]> => {
  const codeToyota = '72030'
  const { daily_quotes: dailyQuotes } = await JQuantsClient<{
    daily_quotes: PricesDailyQuotesStruct[]
  }>('/v1/prices/daily_quotes', { code: codeToyota })
  const dates = dailyQuotes.map(dq => dq.Date)
  console.log(`Successfully got business days from JQuants: ${dates.length} days.`)
  return _filterAndSort(dates, from, to)
}

export const getBusinessDaysFromS3 = async (from?: string, to?: string): Promise<string[]> => {
  const params = {
    Bucket: getProcessEnv('S3_BUCKET_NAME'),
    Key: 'business_days.json'
  }
  const businessDaysS3RawData = await s3Client.send(new GetObjectCommand(params))
  const businessDays = await businessDaysS3RawData.Body?.transformToString()
  if (businessDays == null) {
    throw new Error('Failed to get business days from S3.')
  }
  const dates = JSON.parse(businessDays) as string[]
  console.log(`Successfully got business days from S3: ${dates.length} days.`)
  return _filterAndSort(dates, from, to)
}

export const saveBusinessDaysToS3 = async (dates: string[]): Promise<void> => {
  const params = {
    Bucket: getProcessEnv('S3_BUCKET_NAME'),
    Key: 'business_days.json',
    Body: JSON.stringify(dates)
  }
  await s3Client.send(new PutObjectCommand(params))
  console.log(`Successfully saved business days to S3: ${dates.length} days.`)
}
