import { unmarshall } from '@aws-sdk/util-dynamodb'
import PricesDailyQuotesStruct from '../interface/jquants/prices_daily_quotes'
import GetProcessEnv from '../common/process_env'
import AWS from 'aws-sdk'
import { ExpressionAttributeValueMap } from 'aws-sdk/clients/dynamodb'
import { getDefaultPeriod } from '../common/dayjs'

type GetDailyQuotesProps = {
  code?: string
  date?: string
  from?: string
  to?: string
}

export const getDailyQuotes = async ({
  code,
  date,
  from,
  to,
}: GetDailyQuotesProps): Promise<PricesDailyQuotesStruct[]> => {
  if (code) {
    return _getDailyQuotesByStock(code, from, to)
  }
  if (date) {
    return _getDailyQuotesByDate(date)
  }
  throw new Error('Missing required parameter: code or date')
}

const _getDailyQuotesByStock = async (
  code: string,
  from?: string,
  to?: string,
): Promise<PricesDailyQuotesStruct[]> => {
  const key_condition_expressions = ['Code = :Code']
  const expression_attribute_values: ExpressionAttributeValueMap = {
    ':Code': {
      S: code,
    },
  }

  const { from: defaultFrom, to: defaultTo } = getDefaultPeriod()
  key_condition_expressions.push('#Date BETWEEN :From AND :To')
  expression_attribute_values[':From'] = {
    S: from ?? defaultFrom,
  }
  expression_attribute_values[':To'] = {
    S: to ?? defaultTo,
  }
  const ddb = new AWS.DynamoDB()
  const params = {
    TableName: GetProcessEnv('PRICES_DAILY_QUOTES_DYNAMODB_TABLE_NAME'),
    KeyConditionExpression: key_condition_expressions.join(' AND '),
    ExpressionAttributeValues: expression_attribute_values,
    ExpressionAttributeNames: {
      '#Date': 'Date',
    },
  }
  const result = await ddb.query(params).promise()
  if (!result.Items) {
    return []
  }
  return result.Items.map(item => unmarshall(item) as PricesDailyQuotesStruct)
}

// TODO: セカンダリインデックス?
const _getDailyQuotesByDate = async (date: string): Promise<PricesDailyQuotesStruct[]> => {
  const ddb = new AWS.DynamoDB()
  const params = {
    TableName: GetProcessEnv('PRICES_DAILY_QUOTES_DYNAMODB_TABLE_NAME'),
    FilterExpression: '#Date = :Date',
    ExpressionAttributeValues: {
      ':Date': {
        S: date,
      },
    },
    ExpressionAttributeNames: {
      '#Date': 'Date',
    },
  }
  const result = await ddb.scan(params).promise()
  if (!result.Items) {
    return []
  }
  return result.Items.map(item => unmarshall(item) as PricesDailyQuotesStruct)
}
