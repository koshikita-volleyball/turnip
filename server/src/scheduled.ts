import { loggerError, loggerInfo } from './common/logger'
import {
  refreshTokenUpdateHandler,
  idTokenUpdateHandler,
  businessDayUpdateHandler,
  listedInfoUpdateHandler,
  pricesDailyQuotesUpdateHandler,
  finsStatementsUpdateHandler,
  slackNotifyHandler
} from './update'

const dailyScheduledFunctions: (() => Promise<string>)[] = [
  refreshTokenUpdateHandler,
  idTokenUpdateHandler,
  businessDayUpdateHandler,
  listedInfoUpdateHandler,
  pricesDailyQuotesUpdateHandler,
  finsStatementsUpdateHandler,
  slackNotifyHandler
]

export const dailyScheduled = async (): Promise<void> => {
  for (const func of dailyScheduledFunctions) {
    const functionName = func.name
    try {
      const message = await func()
      loggerInfo(functionName, `${message}`)
    } catch (error: unknown) {
      if (error instanceof Error) {
        loggerError(functionName, error.message)
      } else {
        loggerError(functionName, "Unknown error")
      }
    }
  }
}
