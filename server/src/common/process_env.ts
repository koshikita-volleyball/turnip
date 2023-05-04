
const SLACK_API_TOKEN = process.env.SLACK_API_TOKEN ?? ''
const SLACK_NOTICE_CHANNEL = process.env.SLACK_NOTICE_CHANNEL ?? ''
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME ?? ''
const JQUANTS_MAILADDRESS = process.env.JQUANTS_MAILADDRESS ?? ''
const JQUANTS_PASSWORD = process.env.JQUANTS_PASSWORD ?? ''

if (SLACK_API_TOKEN === '') console.error('SLACK_API_TOKEN is empty.')
if (SLACK_NOTICE_CHANNEL === '') console.error('SLACK_NOTICE_CHANNEL is empty.')
if (S3_BUCKET_NAME === '') console.error('S3_BUCKET_NAME is empty.')
if (JQUANTS_MAILADDRESS === '') console.error('JQUANTS_MAILADDRESS is empty.')
if (JQUANTS_PASSWORD === '') console.error('JQUANTS_PASSWORD is empty.')

export { SLACK_API_TOKEN, SLACK_NOTICE_CHANNEL, S3_BUCKET_NAME, JQUANTS_MAILADDRESS, JQUANTS_PASSWORD }
