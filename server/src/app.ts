/* eslint-disable @typescript-eslint/require-await */
import dotenv from 'dotenv'
import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda'
import JQuantsClient from './common/jquants_client'
import ListedInfoStruct from './interface/jquants/listed_info'
import { GetRefreshToken } from './common/get_id_token'
import PricesDailyQuotesStruct from './interface/jquants/prices_daily_quotes'
import { WebClient, LogLevel } from '@slack/web-api'
import AWS from './common/aws'
import GetIdToken from './common/get_id_token'
import GetProcessEnv from './common/process_env'
import { notify } from './common/slack'
import { getStockByCode, getStocks } from './model/stock'
import {
  getIndicatorParams,
  getPaginationParams,
  getStockCommonFilterParams,
} from './common/query_parser'
import paginate from './common/pagination'
import { Stock } from './interface/turnip/stock'
import { getDailyQuotes } from './model/daily_quotes'
import { getBusinessDaysFromJQuants, saveBusinessDaysToS3 } from './model/jpx_business_day'
import { getBusinessDays } from './analysis/jpx_business_day'
import dayjs from './common/dayjs'

dotenv.config()

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS,PATCH',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export const lambdaHandler = async (): Promise<APIGatewayProxyResult> => {
  try {
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        message: 'hello world',
      }),
    }
  } catch (err: unknown) {
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

export const business_day_handler = async (): Promise<APIGatewayProxyResult> => {
  try {
    const dates = await getBusinessDays()
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify(dates),
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

export const business_day_update_handler = async (): Promise<void> => {
  try {
    const dates = await getBusinessDaysFromJQuants()
    await saveBusinessDaysToS3(dates)
    await notify('営業日情報を更新しました :spiral_calendar_pad:')
  } catch (err) {
    if (err instanceof Error) {
      console.error(`[ERROR] ${err.message}`)
    }
  }
}

export const info_handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  try {
    const code = event.queryStringParameters?.code

    if (!code) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          message: 'code is required',
        }),
      }
    }

    const stock = await getStockByCode(code)
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify(stock),
    }
  } catch (err: unknown) {
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

export const listed_info_handler = async (
  event: APIGatewayEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    const { page } = getPaginationParams(event)
    const stockCommonFilterParams = getStockCommonFilterParams(event)
    const company_name = event.queryStringParameters?.company_name

    const stocks = await getStocks({ ...stockCommonFilterParams, company_name })

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify(paginate<Stock>(stocks, page)),
    }
  } catch (err: unknown) {
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

export const prices_daily_quotes_handler = async (
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
          message: 'code is required',
        }),
      }
    }

    const dailyQuotes = await getDailyQuotes({ code, date, from, to })

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify(dailyQuotes),
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
  const channel = GetProcessEnv('SLACK_NOTICE_CHANNEL')
  const result = await slackClient.chat.postMessage({
    text: '朝７時だよ！ :tori:',
    channel,
  })
  console.log(`Successfully send message ${result.ts ?? 'xxxxx'} in conversation ${channel}.`)
}

export const refresh_token_updater_handler = async (): Promise<void> => {
  try {
    const refresh_token = await GetRefreshToken()
    const s3 = new AWS.S3()
    const bucket = GetProcessEnv('S3_BUCKET_NAME')
    const key = 'refresh_token.txt'
    const params = {
      Bucket: bucket,
      Key: key,
      Body: refresh_token,
    }
    await s3.putObject(params).promise()
    const slackClient = new WebClient(process.env.SLACK_API_TOKEN, {
      logLevel: LogLevel.DEBUG,
    })
    const THREE_BACK_QUOTES = '```'
    const channel = GetProcessEnv('SLACK_NOTICE_CHANNEL')
    const result = await slackClient.chat.postMessage({
      text: `:tori::tori::tori: リフレッシュトークンを更新しました！ :tori::tori::tori:\n\n${THREE_BACK_QUOTES}\n${refresh_token}\n${THREE_BACK_QUOTES}`,
      channel,
    })
    console.log(`Successfully send message ${result.ts ?? 'xxxxx'} in conversation ${channel}.`)
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(`[ERROR] ${err.message}`)
    }
  }
}

export const id_token_updater_handler = async (): Promise<void> => {
  try {
    // S3からリフレッシュトークンを取得
    const bucket = GetProcessEnv('S3_BUCKET_NAME')
    const s3 = new AWS.S3()
    const params = {
      Bucket: bucket,
      Key: 'refresh_token.txt',
    }
    const data = await s3.getObject(params).promise()
    const refreshToken = data.Body?.toString('utf-8')
    if (refreshToken) {
      console.log('refreshToken: ', refreshToken)
      // リフレッシュトークンを使ってIDトークンを更新
      const id_token = await GetIdToken(refreshToken)
      // S3にIDトークンを保存
      const params = {
        Bucket: bucket,
        Key: 'id_token.txt',
        Body: id_token,
      }
      await s3.putObject(params).promise()

      // Slackに通知
      const slackClient = new WebClient(process.env.SLACK_API_TOKEN, {
        logLevel: LogLevel.DEBUG,
      })
      const THREE_BACK_QUOTE = '```'
      const channel = GetProcessEnv('SLACK_NOTICE_CHANNEL')
      const result = await slackClient.chat.postMessage({
        text: `:tori::tori::tori: IDトークンを更新しました :tori::tori::tori:\n\n${THREE_BACK_QUOTE}${id_token}${THREE_BACK_QUOTE}`,
        channel,
      })
      console.log(`Successfully send message ${result.ts ?? 'xxxxx'} in conversation ${channel}.`)
    } else {
      console.log('refresh_token.txt is empty')
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(`[ERROR] ${err.message}`)
    }
  }
}

export const listed_info_updater_handler = async (): Promise<void> => {
  try {
    const { info: stocks } = await JQuantsClient<{ info: ListedInfoStruct[] }>('/v1/listed/info')
    // DynamoDBに保存
    const dynamoClient = new AWS.DynamoDB.DocumentClient()
    const tableName = GetProcessEnv('LISTED_INFO_DYNAMODB_TABLE_NAME')
    for (const stock of stocks) {
      const params = {
        TableName: tableName,
        Item: {
          Code: stock.Code,
          Date: stock.Date,
          CompanyName: stock.CompanyName,
          CompanyNameEnglish: stock.CompanyNameEnglish,
          Sector17Code: stock.Sector17Code,
          Sector17CodeName: stock.Sector17CodeName,
          Sector33Code: stock.Sector33Code,
          Sector33CodeName: stock.Sector33CodeName,
          ScaleCategory: stock.ScaleCategory,
          MarketCode: stock.MarketCode,
          MarketCodeName: stock.MarketCodeName,
        },
      }
      await dynamoClient.put(params).promise()
    }
    // Slackに通知
    const slackClient = new WebClient(GetProcessEnv('SLACK_API_TOKEN'), {
      logLevel: LogLevel.DEBUG,
    })
    const channel = GetProcessEnv('SLACK_NOTICE_CHANNEL')
    const result = await slackClient.chat.postMessage({
      text: `:tori::tori::tori: 銘柄情報を更新しました！ :tori::tori::tori:`,
      channel,
    })
    console.log(`Successfully send message ${result.ts ?? 'xxxxx'} in conversation ${channel}.`)
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(`[ERROR] ${err.message}`)
    }
  }
}

export const prices_daily_quotes_updater_handler = async (): Promise<void> => {
  try {
    const today = dayjs().format('YYYY-MM-DD')
    const { daily_quotes: prices } = await JQuantsClient<{
      daily_quotes: PricesDailyQuotesStruct[]
    }>('/v1/prices/daily_quotes', {
      date: today,
    })
    const dynamoClient = new AWS.DynamoDB.DocumentClient()
    const tableName = GetProcessEnv('PRICES_DAILY_QUOTES_DYNAMODB_TABLE_NAME')
    for (const price of prices) {
      // DynamoDBに保存
      const params = {
        TableName: tableName,
        Item: {
          Code: price.Code,
          Date: price.Date,
          Open: price.Open,
          High: price.High,
          Low: price.Low,
          Close: price.Close,
          Volume: price.Volume,
          TurnoverValue: price.TurnoverValue,
          AdjustmentHigh: price.AdjustmentHigh,
          AdjustmentLow: price.AdjustmentLow,
          AdjustmentClose: price.AdjustmentClose,
          AdjustmentVolume: price.AdjustmentVolume,
        },
      }
      await dynamoClient.put(params).promise()
    }
    // Slackに通知
    const slackClient = new WebClient(GetProcessEnv('SLACK_API_TOKEN'), {
      logLevel: LogLevel.DEBUG,
    })
    const channel = GetProcessEnv('SLACK_NOTICE_CHANNEL')
    const result = await slackClient.chat.postMessage({
      text: `:tori::tori::tori: 株価四本値情報を更新しました！ :tori::tori::tori:`,
      channel,
    })
    console.log(`Successfully send message ${result.ts ?? 'xxxxx'} in conversation ${channel}.`)
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(`[ERROR] ${err.message}`)
    }
  }
}

export const screener_handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  // get query params
  const stockCommonFilter = getStockCommonFilterParams(event)
  const indicatorParams = getIndicatorParams(event)

  return {
    statusCode: 500,
    headers: CORS_HEADERS,
    body: JSON.stringify({ stockCommonFilter, indicatorParams }),
  }
}

// テクニカル系のハンドラー

/**
 * 前営業日からの終値の変化率が一定以上の銘柄を返す。
 */

// export const growth_rate_close_handler = async (): // event: APIGatewayEvent,
// Promise<APIGatewayProxyResult> => {
// 閾値を取得
// const threshold = event.queryStringParameters?.threshold

// const res: GrowthRateClose[] = []

// const dates = await getBusinessDays()
// const { daily_quotes: daily_quotes_before } = await JQuantsClient<{
//   daily_quotes: PricesDailyQuotesStruct[]
// }>('/v1/prices/daily_quotes', {
//   date: dates[dates.length - 2].format('YYYY-MM-DD'),
// })

// const { daily_quotes: daily_quotes_after } = await JQuantsClient<{
//   daily_quotes: PricesDailyQuotesStruct[]
// }>('/v1/prices/daily_quotes', {
//   date: dates[dates.length - 1].format('YYYY-MM-DD'),
// })

// for (const dq_before of daily_quotes_before) {
//   const dq_after = daily_quotes_after.find(dq => dq.Code === dq_before.Code)
//   if (!dq_after || !dq_before.Close || !dq_after.Close) continue

//   const growth_rate = (dq_after.Close - dq_before.Close) / dq_before.Close
//   if (!threshold || growth_rate > parseFloat(threshold)) {
//     res.push({
//       code: dq_before.Code,
//       growth_rate,
//       daily_quotes: {
//         before: dq_before,
//         after: dq_after,
//       },
//     })
//   }
// }
// res.sort((a, b) => b.growth_rate - a.growth_rate)

//   return {
//     statusCode: 500,
//     headers: CORS_HEADERS,
//     body: 'not implemented',
//   }
// }
