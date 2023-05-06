type ProcessEnvKey =
  | 'SLACK_API_TOKEN'
  | 'SLACK_NOTICE_CHANNEL'
  | 'S3_BUCKET_NAME'
  | 'JQUANTS_MAILADDRESS'
  | 'JQUANTS_PASSWORD'
  | 'LISTED_INFO_DYNAMODB_TABLE_NAME'
  | 'PRICES_DAILY_QUOTES_DYNAMODB_TABLE_NAME'

function GetProcessEnv(key: ProcessEnvKey): string {
  const value = process.env[key] ?? ''
  if (value === '') {
    console.error(`[ERROR] ${key} is not defined.`)
  }
  return value
}

export default GetProcessEnv
