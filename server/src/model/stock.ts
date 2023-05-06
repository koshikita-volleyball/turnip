import AWS from 'aws-sdk'
import { unmarshall } from '@aws-sdk/util-dynamodb'
import { Stock } from '../interface/turnip/stock'
import GetProcessEnv from '../common/process_env'

export const getStocks = async (
  codes?: string[],
  sector17Codes?: string[],
  sector33Codes?: string[],
  marketCodes?: string[],
): Promise<Stock[]> => {
  const ddb = new AWS.DynamoDB()

  // TODO スキャンではなくセカンダリインデックスを使用する。#267
  const params = {
    TableName: GetProcessEnv('LISTED_INFO_DYNAMODB_TABLE_NAME'),
  }
  const stocks = ((await ddb.scan(params).promise()).Items || []).map(
    item => unmarshall(item) as Stock,
  )
  return stocks
    .filter(
      stock =>
        (!codes || codes.includes(stock.Code)) &&
        (!sector17Codes || sector17Codes.includes(stock.Sector17Code)) &&
        (!sector33Codes || sector33Codes.includes(stock.Sector33Code)) &&
        (!marketCodes || marketCodes.includes(stock.MarketCode)),
    )
    .sort((a, b) => a.Code.localeCompare(b.Code))
}

export const getStockByCode = async (code: string): Promise<Stock | null> => {
  const ddb = new AWS.DynamoDB()
  const params = {
    TableName: GetProcessEnv('LISTED_INFO_DYNAMODB_TABLE_NAME'),
    Key: {
      Code: {
        S: code,
      },
    },
  }
    const result = await ddb.getItem(params).promise()
    if (!result.Item) {
      return null
    }
    return unmarshall(result.Item) as Stock
  }
