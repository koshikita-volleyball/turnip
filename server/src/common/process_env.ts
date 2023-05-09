type ProcessEnvKey =
  | 'ENVIRONMENT'
  | 'SLACK_API_TOKEN'
  | 'SLACK_CHANNEL_NOTICE'
  | 'SLACK_CHANNEL_PRODUCTION_LOG'
  | 'SLACK_CHANNEL_PRODUCTION_ERROR'
  | 'SLACK_CHANNEL_STAGING_LOG'
  | 'SLACK_CHANNEL_STAGING_ERROR'
  | 'SLACK_CHANNEL_DEVELOP_LOG'
  | 'SLACK_CHANNEL_DEVELOP_ERROR'
  | 'S3_BUCKET_NAME'
  | 'JQUANTS_MAILADDRESS'
  | 'JQUANTS_PASSWORD'
  | 'LISTED_INFO_DYNAMODB_TABLE_NAME'
  | 'PRICES_DAILY_QUOTES_DYNAMODB_TABLE_NAME'
  | 'FINS_STATEMENTS_DYNAMODB_TABLE_NAME'

function GetProcessEnv(key: ProcessEnvKey): string {
  const value = process.env[key] ?? ''
  if (value === '') {
    console.error(`[ERROR] ${key} is not defined.`)
  }
  return value
}

export default GetProcessEnv
