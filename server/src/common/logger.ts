import dayjs from './dayjs'
import { notify } from './slack'

type Level = 'info' | 'error'

function _formatLog (level: Level, funcName: string, text: string): string {
  const datetime = dayjs().format('YYYY-MM-DD HH:mm:ss')
  return `【${level}】\t${datetime}\t${funcName}\t${text}`
}

function _formatSlack (level: Level, funcName: string, text: string): string {
  const dateTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
  const levelStr = level === 'info' ? ':large_blue_circle: Info' : ':red_circle: Error'
  return `【Level】${levelStr}\n【時刻】${dateTime}\n【関数名】${funcName}\n【メッセージ】${text}`
}

function loggerInfo (funcName: string, text: string): void {
  console.log(_formatLog('info', funcName, text))
  notify(_formatSlack('info', funcName, text), 'info').then().catch(console.error)
}

function loggerError (funcName: string, text: string): void {
  console.error(_formatLog('error', funcName, text))
  notify(_formatSlack('error', funcName, text), 'error').then().catch(console.error)
}

const THREE_BACK_QUOTES = '```'
function makeCodeBlock (text: string): string {
  return `${THREE_BACK_QUOTES}${text}${THREE_BACK_QUOTES}`
}

export { loggerInfo, loggerError, makeCodeBlock }
