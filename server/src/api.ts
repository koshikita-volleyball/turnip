/* eslint-disable @typescript-eslint/require-await */
import './common/initializer'
import { APIGatewayEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { WebClient, LogLevel } from '@slack/web-api'
import GetProcessEnv from './common/process_env'
import { getStockByCode, getStocks } from './model/stock'
import {
  check_required,
  getIndicatorParams,
  getPaginationParams,
  getStockCodedParams,
  getStockCommonFilterParams,
} from './common/query_parser'
import paginate from './common/pagination'
import { Stock } from './interface/turnip/stock'
import { getDailyQuotes } from './model/daily_quotes'
import { getFinsStatements } from './model/fins_statements'
import { CORS_HEADERS } from './common/const'
import { NotFoundError } from './interface/turnip/error'
import { api, APIFn } from './common/handler'
import { getBusinessDays } from './screener/utils'

export const lambdaHandler: APIGatewayProxyHandler = async event => {
  const fn: APIFn = () => {
    return 'Hello World'
  }
  return api(fn, event)
}

export const business_day_handler: APIGatewayProxyHandler = async event => {
  const fn: APIFn = async () => {
    const dates = await getBusinessDays()
    return JSON.stringify(dates)
  }
  return api(fn, event)
}

export const info_handler: APIGatewayProxyHandler = async event => {
  const fn: APIFn = async event => {
    const { code: _code } = getStockCodedParams(event)
    const code = check_required('code', _code)
    const stock = await getStockByCode(code)
    if (!stock) {
      throw new NotFoundError(`code: ${code} is not found`)
    }
    return JSON.stringify('hello')
  }
  return api(fn, event)
}

export const listed_info_handler: APIGatewayProxyHandler = async event => {
  const fn: APIFn = async event => {
    // get params
    const { page } = getPaginationParams(event)
    const stockCommonFilterParams = getStockCommonFilterParams(event)
    const company_name = event.queryStringParameters?.company_name

    // get stocks from dynamodb
    const stocks = await getStocks({ ...stockCommonFilterParams, company_name })

    return JSON.stringify(paginate<Stock>(stocks, page))
  }
  return api(fn, event)
}

export const prices_daily_quotes_handler: APIGatewayProxyHandler = async event => {
  const fn: APIFn = async event => {
    const code = event.queryStringParameters?.code
    const date = event.queryStringParameters?.date
    const from = event.queryStringParameters?.from
    const to = event.queryStringParameters?.to
    check_required('code', code)

    const dailyQuotes = await getDailyQuotes({ code, date, from, to })

    return JSON.stringify(dailyQuotes)
  }
  return api(fn, event)
}

export const fins_statements_handler = async (
  event: APIGatewayEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    const code = event.queryStringParameters?.code
    const date = event.queryStringParameters?.date
    const from = event.queryStringParameters?.from
    const to = event.queryStringParameters?.to

    if (!code) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          message: 'code is required.',
        }),
      }
    }

    const finsStatements = await getFinsStatements({ code, date, from, to })

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify(finsStatements),
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error(`[ERROR] ${err.message}`)
    }
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        message: err,
      }),
    }
  }
}

export const slack_notify_handler = async (): Promise<void> => {
  const slackClient = new WebClient(GetProcessEnv('SLACK_API_TOKEN'), {
    logLevel: LogLevel.DEBUG,
  })
  const channel = GetProcessEnv('SLACK_CHANNEL_NOTICE')
  const result = await slackClient.chat.postMessage({
    text: '朝７時だよ！ :tori:',
    channel,
  })
  console.log(`Successfully send message ${result.ts ?? 'xxxxx'} in conversation ${channel}.`)
}

export const screener_handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  const stockCommonFilter = getStockCommonFilterParams(event)
  const indicatorParams = await getIndicatorParams(event)

  return {
    statusCode: 200,
    headers: CORS_HEADERS,
    body: JSON.stringify({ stockCommonFilter, indicatorParams }),
  }
}
