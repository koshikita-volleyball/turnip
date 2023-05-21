/* eslint-disable @typescript-eslint/require-await */
import './common/initializer'
import { type APIGatewayEvent, type APIGatewayProxyHandler, type APIGatewayProxyResult } from 'aws-lambda'
import { WebClient, LogLevel } from '@slack/web-api'
import GetProcessEnv from './common/process_env'
import { getStockByCode, getStocks } from './model/stock'
import {
  checkRequired,
  getIndicatorParams,
  getPaginationParams,
  getStockCodedParams,
  getStockCommonFilterParams
} from './common/query_parser'
import paginate from './common/pagination'
import { type Stock } from './interface/turnip/stock'
import { getDailyQuotes } from './model/daily_quotes'
import { getFinsStatements } from './model/fins_statements'
import { CORS_HEADERS } from './common/const'
import { NotFoundError } from './interface/turnip/error'
import { api, type APIFn } from './common/handler'
import { getBusinessDays } from './analysis/jpx_business_day'

export const lambdaHandler: APIGatewayProxyHandler = async event => {
  const fn: APIFn = () => {
    return 'Hello World'
  }
  return await api(fn, event)
}

export const businessDayHandler: APIGatewayProxyHandler = async event => {
  const fn: APIFn = async () => {
    const dates = await getBusinessDays()
    return JSON.stringify(dates)
  }
  return await api(fn, event)
}

export const infoHandler: APIGatewayProxyHandler = async event => {
  const fn: APIFn = async event => {
    const { code: _code } = getStockCodedParams(event)
    const code = checkRequired('code', _code)
    const stock = await getStockByCode(code)
    if (stock == null) {
      throw new NotFoundError(`code: ${code} is not found.`)
    }
    return JSON.stringify(stock)
  }
  return await api(fn, event)
}

export const listedInfoHandler: APIGatewayProxyHandler = async event => {
  const fn: APIFn = async event => {
    // get params
    const { page } = getPaginationParams(event)
    const stockCommonFilterParams = getStockCommonFilterParams(event)
    const companyName = event.queryStringParameters?.company_name

    // get stocks from dynamodb
    const stocks = await getStocks({ ...stockCommonFilterParams, company_name: companyName })

    return JSON.stringify(paginate<Stock>(stocks, page))
  }
  return await api(fn, event)
}

export const pricesDailyQuotesHandler: APIGatewayProxyHandler = async event => {
  const fn: APIFn = async event => {
    const code = event.queryStringParameters?.code
    const date = event.queryStringParameters?.date
    const from = event.queryStringParameters?.from
    const to = event.queryStringParameters?.to
    checkRequired('code', code)

    const dailyQuotes = await getDailyQuotes({ code, date, from, to })

    return JSON.stringify(dailyQuotes)
  }
  return await api(fn, event)
}

export const finsStatementsHandler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const code = event.queryStringParameters?.code
    const date = event.queryStringParameters?.date
    const from = event.queryStringParameters?.from
    const to = event.queryStringParameters?.to

    if (code === undefined) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          message: 'code is required.'
        })
      }
    }

    const finsStatements = await getFinsStatements({ code, date, from, to })

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify(finsStatements)
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error(`[ERROR] ${err.message}`)
    }
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        message: err
      })
    }
  }
}

export const slackNotifyHandler = async (): Promise<void> => {
  const slackClient = new WebClient(GetProcessEnv('SLACK_API_TOKEN'), {
    logLevel: LogLevel.DEBUG
  })
  const channel = GetProcessEnv('SLACK_CHANNEL_NOTICE')
  const result = await slackClient.chat.postMessage({
    text: '朝７時だよ！ :tori:',
    channel
  })
  console.log(`Successfully send message ${result.ts ?? 'xxxxx'} in conversation ${channel}.`)
}

export const screenerHandler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  const stockCommonFilter = getStockCommonFilterParams(event)
  const indicatorParams = await getIndicatorParams(event)

  return {
    statusCode: 200,
    headers: CORS_HEADERS,
    body: JSON.stringify({ stockCommonFilter, indicatorParams })
  }
}
