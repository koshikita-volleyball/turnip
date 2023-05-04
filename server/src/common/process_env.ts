
type ProcessEnvKey =
  |'SLACK_API_TOKEN'
  |'SLACK_NOTICE_CHANNEL'
  |'S3_BUCKET_NAME'
  |'JQUANTS_MAILADDRESS'
  |'JQUANTS_PASSWORD'

function GetProcessEnv(key: ProcessEnvKey): string {
  const value = process.env[key] ?? ''
  if (value === '') {
    console.error(`[ERROR] ${key} is not defined.`)
  }
  return value
}

export default GetProcessEnv
