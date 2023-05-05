import { WebClient, LogLevel } from '@slack/web-api'
import GetProcessEnv from './process_env'

export const notify = async (text: string): Promise<void> => {
  const slackClient = new WebClient(GetProcessEnv('SLACK_API_TOKEN'), {
    logLevel: LogLevel.DEBUG,
  })
  const channel = GetProcessEnv('SLACK_NOTICE_CHANNEL')
  const result = await slackClient.chat.postMessage({ text, channel })
  console.log(`Successfully send message ${result.ts ?? 'xxxxx'} in conversation ${channel}.`)
}
