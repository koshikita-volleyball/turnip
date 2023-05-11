import { WebClient, LogLevel } from '@slack/web-api'
import GetProcessEnv from './process_env'

type Category = 'notice' | 'info' | 'error'

const getChannel = (category: Category): string => {
  if (category === 'notice') {
    return GetProcessEnv('SLACK_CHANNEL_NOTICE')
  }
  const environment = GetProcessEnv('ENVIRONMENT')
  switch (environment) {
    case 'production':
      switch (category) {
        case 'error':
          return GetProcessEnv('SLACK_CHANNEL_PRODUCTION_ERROR')
        default:
          return GetProcessEnv('SLACK_CHANNEL_PRODUCTION_LOG')
      }
    case 'staging':
      switch (category) {
        case 'error':
          return GetProcessEnv('SLACK_CHANNEL_STAGING_ERROR')
        default:
          return GetProcessEnv('SLACK_CHANNEL_STAGING_LOG')
      }
    default:
      switch (category) {
        case 'error':
          return GetProcessEnv('SLACK_CHANNEL_DEVELOP_ERROR')
        default:
          return GetProcessEnv('SLACK_CHANNEL_DEVELOP_LOG')
      }
  }
}

export const notify = async (text: string, category: Category = 'notice'): Promise<void> => {
  const slackClient = new WebClient(GetProcessEnv('SLACK_API_TOKEN'), {
    logLevel: LogLevel.DEBUG,
  })
  const channel = getChannel(category)
  const result = await slackClient.chat.postMessage({ text, channel })
  console.log(`Successfully send message ${result.ts ?? 'xxxxx'} in conversation ${channel}.`)
}
