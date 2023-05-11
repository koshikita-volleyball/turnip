import dayjs from './dayjs'
import { notify } from './slack'

type Level = 'info' | 'error'

class Logger {
  static _format_log(level: Level, funcName: string, text: string) {
    const datetime = dayjs().format('YYYY-MM-DD HH:mm:ss')
    return `【${level}】\t${datetime}\t${funcName}\t${text}`
  }
  static _format_slack(level: Level, funcName: string, text: string) {
    const dateTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
    const level_str = level === 'info' ? ':large_blue_circle: Info' : ':red_circle: Error'
    return `【Level】${level_str}\n【時刻】${dateTime}\n【関数名】${funcName}\n【メッセージ】${text}`
  }
  static log(funcName: string, text: string) {
    console.log(this._format_log('info', funcName, text))
    notify(this._format_slack('info', funcName, text), 'info').then().catch(console.error)
  }
  static error(funcName: string, text: string) {
    console.error(this._format_log('error', funcName, text))
    notify(this._format_slack('error', funcName, text), 'error').then().catch(console.error)
  }
}

export default Logger
