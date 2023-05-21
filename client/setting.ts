import Env from './next.config.js'
const isProd = process.env.NODE_ENV === 'production'

interface SettingStruct {
  isProd: boolean
  basePath: string
  apiPath: string
  title: string
}

const setting: SettingStruct = {
  isProd,
  basePath: Env.basePath,
  apiPath: process.env.NEXT_PUBLIC_LAMBDA_API_URL,
  title: '🌱 Turnip 🌱'
}

export default setting
