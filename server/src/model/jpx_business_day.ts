import AWS from 'aws-sdk'
import JQuantsClient from '../common/jquants_client'
import GetProcessEnv from '../common/process_env'
import type PricesDailyQuotesStruct from '../interface/jquants/prices_daily_quotes'

const _filter_and_sort = (dates: string[], from?: string, to?: string): string[] =>
  dates
    .filter(d => {
      if (from && d < from) return false
      if (to && d > to) return false
      return true
    })
    .sort((a, b) => a.localeCompare(b))

export const getBusinessDaysFromJQuants = async (from?: string, to?: string): Promise<string[]> => {
  const code_toyota = '72030'
  const { daily_quotes } = await JQuantsClient<{
    daily_quotes: PricesDailyQuotesStruct[]
  }>('/v1/prices/daily_quotes', { code: code_toyota })
  const dates = daily_quotes.map(dq => dq.Date)
  console.log(`Successfully got business days from JQuants: ${dates.length} days`)
  return _filter_and_sort(dates, from, to)
}

export const getBusinessDaysFromS3 = async (from?: string, to?: string): Promise<string[]> => {
  const s3 = new AWS.S3()
  const params = {
    Bucket: GetProcessEnv('S3_BUCKET_NAME'),
    Key: 'business_days.json'
  }
  const data = (await s3.getObject(params).promise()).Body?.toString('utf-8')
  if (!data) {
    throw new Error('Failed to get business days from S3')
  }
  const dates = JSON.parse(data) as string[]
  console.log(`Successfully got business days from S3: ${dates.length} days`)
  return _filter_and_sort(dates, from, to)
}

export const saveBusinessDaysToS3 = async (dates: string[]): Promise<void> => {
  const s3 = new AWS.S3()
  const params = {
    Bucket: GetProcessEnv('S3_BUCKET_NAME'),
    Key: 'business_days.json',
    Body: JSON.stringify(dates)
  }
  await s3.putObject(params).promise()
  console.log(`Successfully saved business days to S3: ${dates.length} days`)
}
