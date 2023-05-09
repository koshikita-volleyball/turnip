/* eslint-disable @typescript-eslint/require-await */
import dotenv from 'dotenv'
import { APIGatewayEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
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
import { getBusinessDaysFromJQuants, saveBusinessDaysToS3 } from './model/jpx_business_day'
import { getBusinessDays } from './analysis/jpx_business_day'
import dayjs from './common/dayjs'
import FinsStatementsStruct from './interface/jquants/fins_statements'
import { CORS_HEADERS } from './common/const'
import { NotFoundError } from './interface/turnip/error'
import { api, APIFn } from './common/handler'

dotenv.config()

export const hello_handler: APIGatewayProxyHandler = async event => {
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

export const fins_statements_updater_handler = async (): Promise<void> => {
  try {
    const today = dayjs().format('YYYY-MM-DD')
    const { statements: statements } = await JQuantsClient<{
      statements: FinsStatementsStruct[]
    }>('/v1/fins/statements', {
      date: today,
    })
    const dynamoClient = new AWS.DynamoDB.DocumentClient()
    const tableName = GetProcessEnv('FINS_STATEMENTS_DYNAMODB_TABLE_NAME')
    for (const statement of statements) {
      // DynamoDBに保存
      const params = {
        TableName: tableName,
        Item: {
          DisclosedDate: statement.DisclosedDate,
          DisclosedTime: statement.DisclosedTime,
          LocalCode: statement.LocalCode,
          DisclosureNumber: statement.DisclosureNumber,
          TypeOfDocument: statement.TypeOfDocument,
          TypeOfCurrentPeriod: statement.TypeOfCurrentPeriod,
          CurrentPeriodStartDate: statement.CurrentPeriodStartDate,
          CurrentPeriodEndDate: statement.CurrentPeriodEndDate,
          CurrentFiscalYearStartDate: statement.CurrentFiscalYearStartDate,
          CurrentFiscalYearEndDate: statement.CurrentFiscalYearEndDate,
          NextFiscalYearStartDate: statement.NextFiscalYearStartDate,
          NextFiscalYearEndDate: statement.NextFiscalYearEndDate,
          NetSales: statement.NetSales,
          OperatingProfit: statement.OperatingProfit,
          OrdinaryProfit: statement.OrdinaryProfit,
          Profit: statement.Profit,
          EarningsPerShare: statement.EarningsPerShare,
          DilutedEarningsPerShare: statement.DilutedEarningsPerShare,
          TotalAssets: statement.TotalAssets,
          Equity: statement.Equity,
          EquityToAssetRatio: statement.EquityToAssetRatio,
          BookValuePerShare: statement.BookValuePerShare,
          CashFlowsFromOperatingActivities: statement.CashFlowsFromOperatingActivities,
          CashFlowsFromInvestingActivities: statement.CashFlowsFromInvestingActivities,
          CashFlowsFromFinancingActivities: statement.CashFlowsFromFinancingActivities,
          CashAndEquivalents: statement.CashAndEquivalents,
          ResultDividendPerShare1stQuarter: statement.ResultDividendPerShare1stQuarter,
          ResultDividendPerShare2ndQuarter: statement.ResultDividendPerShare2ndQuarter,
          ResultDividendPerShare3rdQuarter: statement.ResultDividendPerShare3rdQuarter,
          ResultDividendPerShareFiscalYearEnd: statement.ResultDividendPerShareFiscalYearEnd,
          ResultDividendPerShareAnnual: statement.ResultDividendPerShareAnnual,
          'DistributionsPerUnit(REIT)': statement['DistributionsPerUnit(REIT)'],
          ResultTotalDividendPaidAnnual: statement.ResultTotalDividendPaidAnnual,
          ResultPayoutRatioAnnual: statement.ResultPayoutRatioAnnual,
          ForecastDividendPerShare1stQuarter: statement.ForecastDividendPerShare1stQuarter,
          ForecastDividendPerShare2ndQuarter: statement.ForecastDividendPerShare2ndQuarter,
          ForecastDividendPerShare3rdQuarter: statement.ForecastDividendPerShare3rdQuarter,
          ForecastDividendPerShareFiscalYearEnd: statement.ForecastDividendPerShareFiscalYearEnd,
          ForecastDividendPerShareAnnual: statement.ForecastDividendPerShareAnnual,
          'ForecastDistributionsPerUnit(REIT)': statement['ForecastDistributionsPerUnit(REIT)'],
          ForecastTotalDividendPaidAnnual: statement.ForecastTotalDividendPaidAnnual,
          ForecastPayoutRatioAnnual: statement.ForecastPayoutRatioAnnual,
          NextYearForecastDividendPerShare1stQuarter:
            statement.NextYearForecastDividendPerShare1stQuarter,
          NextYearForecastDividendPerShare2ndQuarter:
            statement.NextYearForecastDividendPerShare2ndQuarter,
          NextYearForecastDividendPerShare3rdQuarter:
            statement.NextYearForecastDividendPerShare3rdQuarter,
          NextYearForecastDividendPerShareFiscalYearEnd:
            statement.NextYearForecastDividendPerShareFiscalYearEnd,
          NextYearForecastDividendPerShareAnnual: statement.NextYearForecastDividendPerShareAnnual,
          'NextYearForecastDistributionsPerUnit(REIT)':
            statement['NextYearForecastDistributionsPerUnit(REIT)'],
          NextYearForecastPayoutRatioAnnual: statement.NextYearForecastPayoutRatioAnnual,
          ForecastNetSales2ndQuarter: statement.ForecastNetSales2ndQuarter,
          ForecastOperatingProfit2ndQuarter: statement.ForecastOperatingProfit2ndQuarter,
          ForecastOrdinaryProfit2ndQuarter: statement.ForecastOrdinaryProfit2ndQuarter,
          ForecastProfit2ndQuarter: statement.ForecastProfit2ndQuarter,
          ForecastEarningsPerShare2ndQuarter: statement.ForecastEarningsPerShare2ndQuarter,
          NextYearForecastNetSales2ndQuarter: statement.NextYearForecastNetSales2ndQuarter,
          NextYearForecastOperatingProfit2ndQuarter:
            statement.NextYearForecastOperatingProfit2ndQuarter,
          NextYearForecastOrdinaryProfit2ndQuarter:
            statement.NextYearForecastOrdinaryProfit2ndQuarter,
          NextYearForecastProfit2ndQuarter: statement.NextYearForecastProfit2ndQuarter,
          NextYearForecastEarningsPerShare2ndQuarter:
            statement.NextYearForecastEarningsPerShare2ndQuarter,
          ForecastNetSales: statement.ForecastNetSales,
          ForecastOperatingProfit: statement.ForecastOperatingProfit,
          ForecastOrdinaryProfit: statement.ForecastOrdinaryProfit,
          ForecastProfit: statement.ForecastProfit,
          ForecastEarningsPerShare: statement.ForecastEarningsPerShare,
          NextYearForecastNetSales: statement.NextYearForecastNetSales,
          NextYearForecastOperatingProfit: statement.NextYearForecastOperatingProfit,
          NextYearForecastOrdinaryProfit: statement.NextYearForecastOrdinaryProfit,
          NextYearForecastProfit: statement.NextYearForecastProfit,
          NextYearForecastEarningsPerShare: statement.NextYearForecastEarningsPerShare,
          MaterialChangesInSubsidiaries: statement.MaterialChangesInSubsidiaries,
          ChangesBasedOnRevisionsOfAccountingStandard:
            statement.ChangesBasedOnRevisionsOfAccountingStandard,
          ChangesOtherThanOnesBasedOnRevisionsOfAccountingStandard:
            statement.ChangesOtherThanOnesBasedOnRevisionsOfAccountingStandard,
          ChangesInAccountingEstimates: statement.ChangesInAccountingEstimates,
          RetrospectiveRestatement: statement.RetrospectiveRestatement,
          NumberOfIssuedAndOutstandingSharesAtTheEndOfFiscalYearIncludingTreasuryStock:
            statement.NumberOfIssuedAndOutstandingSharesAtTheEndOfFiscalYearIncludingTreasuryStock,
          NumberOfTreasuryStockAtTheEndOfFiscalYear:
            statement.NumberOfTreasuryStockAtTheEndOfFiscalYear,
          AverageNumberOfShares: statement.AverageNumberOfShares,
          NonConsolidatedNetSales: statement.NonConsolidatedNetSales,
          NonConsolidatedOperatingProfit: statement.NonConsolidatedOperatingProfit,
          NonConsolidatedOrdinaryProfit: statement.NonConsolidatedOrdinaryProfit,
          NonConsolidatedProfit: statement.NonConsolidatedProfit,
          NonConsolidatedEarningsPerShare: statement.NonConsolidatedEarningsPerShare,
          NonConsolidatedTotalAssets: statement.NonConsolidatedTotalAssets,
          NonConsolidatedEquity: statement.NonConsolidatedEquity,
          NonConsolidatedEquityToAssetRatio: statement.NonConsolidatedEquityToAssetRatio,
          NonConsolidatedBookValuePerShare: statement.NonConsolidatedBookValuePerShare,
          ForecastNonConsolidatedNetSales2ndQuarter:
            statement.ForecastNonConsolidatedNetSales2ndQuarter,
          ForecastNonConsolidatedOperatingProfit2ndQuarter:
            statement.ForecastNonConsolidatedOperatingProfit2ndQuarter,
          ForecastNonConsolidatedOrdinaryProfit2ndQuarter:
            statement.ForecastNonConsolidatedOrdinaryProfit2ndQuarter,
          ForecastNonConsolidatedProfit2ndQuarter:
            statement.ForecastNonConsolidatedProfit2ndQuarter,
          ForecastNonConsolidatedEarningsPerShare2ndQuarter:
            statement.ForecastNonConsolidatedEarningsPerShare2ndQuarter,
          NextYearForecastNonConsolidatedNetSales2ndQuarter:
            statement.NextYearForecastNonConsolidatedNetSales2ndQuarter,
          NextYearForecastNonConsolidatedOperatingProfit2ndQuarter:
            statement.NextYearForecastNonConsolidatedOperatingProfit2ndQuarter,
          NextYearForecastNonConsolidatedOrdinaryProfit2ndQuarter:
            statement.NextYearForecastNonConsolidatedOrdinaryProfit2ndQuarter,
          NextYearForecastNonConsolidatedProfit2ndQuarter:
            statement.NextYearForecastNonConsolidatedProfit2ndQuarter,
          NextYearForecastNonConsolidatedEarningsPerShare2ndQuarter:
            statement.NextYearForecastNonConsolidatedEarningsPerShare2ndQuarter,
          ForecastNonConsolidatedNetSales: statement.ForecastNonConsolidatedNetSales,
          ForecastNonConsolidatedOperatingProfit: statement.ForecastNonConsolidatedOperatingProfit,
          ForecastNonConsolidatedOrdinaryProfit: statement.ForecastNonConsolidatedOrdinaryProfit,
          ForecastNonConsolidatedProfit: statement.ForecastNonConsolidatedProfit,
          ForecastNonConsolidatedEarningsPerShare:
            statement.ForecastNonConsolidatedEarningsPerShare,
          NextYearForecastNonConsolidatedNetSales:
            statement.NextYearForecastNonConsolidatedNetSales,
          NextYearForecastNonConsolidatedOperatingProfit:
            statement.NextYearForecastNonConsolidatedOperatingProfit,
          NextYearForecastNonConsolidatedOrdinaryProfit:
            statement.NextYearForecastNonConsolidatedOrdinaryProfit,
          NextYearForecastNonConsolidatedProfit: statement.NextYearForecastNonConsolidatedProfit,
          NextYearForecastNonConsolidatedEarningsPerShare:
            statement.NextYearForecastNonConsolidatedEarningsPerShare,
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
      text: `:tori::tori::tori: 財務情報を更新しました！ :tori::tori::tori:`,
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
  const stockCommonFilter = getStockCommonFilterParams(event)
  const indicatorParams = await getIndicatorParams(event)

  return {
    statusCode: 200,
    headers: CORS_HEADERS,
    body: JSON.stringify({ stockCommonFilter, indicatorParams }),
  }
}
